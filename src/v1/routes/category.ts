import { Router } from "express";
import { verifyToken } from "../middleWare/tokenHandler";
import { category } from "../controller/category";

const router = Router();

// カテゴリ新規作成
router.post("/", verifyToken, category.create);
// カテゴリ一覧取得
router.get("/", verifyToken, category.getAll);
// カテゴリ編集
router.put("/:categoryId", verifyToken, category.update);
// カテゴリ削除
router.delete("/:categoryId", verifyToken, category.delete);

module.exports = router;
