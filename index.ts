import express from "express";

const app = express();
const PORT = 8000;
require("dotenv").config();

import CryptoJS from "crypto-js";
import JWT from "jsonwebtoken";

import { connectToDatabase } from "./src/v1/controller/connectToDatabase";
import { validationUser } from "./src/v1/middleWare/validationUser";
import { body } from "express-validator";
import User from "./src/v1/models/User";
import { serverEnv } from "./serverEnv";

app.use(express.json());

// DB接続
connectToDatabase();

// ユーザ新規登録
app.post(
  "/register",
  body("username")
    .isLength({ min: 4 })
    .withMessage("ユーザ名は4文字以上である必要があります"),
  body("email").isEmail().withMessage("メールアドレスの形式が不正です"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("パスワードは8文字以上である必要があります"),
  body("confirmPassword")
    .isLength({ min: 8 })
    .withMessage("確認用パスワードは8文字以上である必要があります"),
  body("email").custom((value) => {
    return User.findOne({ email: value }).then((user) => {
      if (user) {
        return Promise.reject("このメールアドレスは既に使用されています");
      }
    });
  }),
  validationUser,
  async (req, res) => {
    const password = req.body.password;
    try {
      // パスワードを暗号化してユーザとトークンを返す
      req.body.password = CryptoJS.AES.encrypt(password, serverEnv.SECRET_KEY);
      const user = await User.create(req.body);
      const token = JWT.sign({ id: user._id }, serverEnv.TOKEN_SECRET_KEY, {
        expiresIn: "24h",
      });
      return res.status(200).json({ user, token });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

// ログインAPI
app.post(
  "/login",
  body("email").isEmail().withMessage("メールアドレスの形式が不正です"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("パスワードは8文字以上である必要があります"),
  validationUser,
  async (req, res) => {
    const { email, password } = req.body;

    try {
      // POSTされたメールアドレスと一致するユーザを探す
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(401).json({
          errors: {
            params: "email",
            message: "メールアドレスが間違っています",
          },
        });
      }

      // パスワードを照合する
      const decryptedPassword = CryptoJS.AES.decrypt(
        user.password,
        serverEnv.SECRET_KEY
      ).toString(CryptoJS.enc.Utf8);

      if (decryptedPassword !== password) {
        return res.status(401).json({
          errors: {
            params: "password",
            message: "パスワードが間違っています",
          },
        });
      }

      const token = JWT.sign({ id: user._id }, serverEnv.TOKEN_SECRET_KEY, {
        expiresIn: "24h",
      });

      return res.status(201).json({ user, token });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

app.listen(PORT, () => {
  console.log("ローカルサーバ起動中");
});
