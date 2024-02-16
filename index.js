const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 8000;
require("dotenv").config();

const CryptoJS = require("crypto-js");
const JWT = require("jsonwebtoken");
const User = require("./src/v1/models/user");

app.use(express.json());

// DB接続
const connectToDatabase = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URL);
    console.log("DBとの接続に成功しました!");
  } catch (err) {
    console.log(err);
  }
};

connectToDatabase();

// ユーザ新規登録
app.post("/register", async (req, res) => {
  const password = req.body.password;
  try {
    // パスワードを暗号化してユーザとトークンを返す
    req.body.password = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY);
    const user = await User.create(req.body);
    const token = JWT.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "24h",
    });
    return res.status(200).json({ user, token });
  } catch (err) {
    return res.status(500).json(err);
  }
});

// ログインAPI
app.post("/login", async (req, res) => {
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
      process.env.SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);

    if (decryptedPassword !== password) {
      return res.status(401).json({
        errors: {
          params: "password",
          message: "パスワードが間違っています",
        },
      });
    }

    const token = JWT.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "24h",
    });

    return res.status(201).json({ user, token });
  } catch (err) {
    return res.status(500).json(err);
  }
});

app.listen(PORT, () => {
  console.log("ローカルサーバ起動中");
});
