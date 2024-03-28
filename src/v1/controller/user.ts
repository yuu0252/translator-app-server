import { Request, Response } from "express";
import User from "../models/user";
import CryptoJS from "crypto-js";
import JWT from "jsonwebtoken";
import { serverEnv } from "../../../serverEnv";

export const userRegister = async (req: Request, res: Response) => {
  try {
    const password = req.body.password;
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
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    // POSTされたメールアドレスと一致するユーザを探す
    const { email, password } = req.body;
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
};
