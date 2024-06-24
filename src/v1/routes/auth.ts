import { Response, Router } from "express";
import { validationUser } from "../middleWare/validationUser";
import { body } from "express-validator";
import User from "../models/user";
import { userLogin, userRegister } from "../controller/user";
import { verifyToken } from "../middleWare/tokenHandler";

const router = Router();

// ユーザ新規登録
router.post(
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
  userRegister
);

// ログインAPI
router.post(
  "/login",
  body("email").isEmail().withMessage("メールアドレスの形式が不正です"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("パスワードは8文字以上である必要があります"),
  validationUser,
  userLogin
);

// JWT認証API
router.post("/verify-token", verifyToken, (req: any, res: Response) => {
  return res.status(200).json({ user: req.user });
});

module.exports = router;
