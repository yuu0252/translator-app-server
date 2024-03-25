import { Router } from "express";
import { verifyToken } from "../middleWare/tokenHandler";
import { phrase } from "../controller/phrase";

const router = Router();

// フレーズの新規作成
router.post("/:categoryId/phrases", verifyToken, phrase.create);
// ユーザのフレーズを取得
router.get("/:categoryId/phrases", verifyToken, phrase.getAll);
// フレーズを編集
router.put("/:categoryId/phrases/:phraseId", verifyToken, phrase.update);
// フレーズを削除
router.delete("/:categoryId/phrases/:phraseId", verifyToken, phrase.delete);
//フレーズの存在チェック
router.post("/phrases/check", verifyToken, phrase.checkExist);

module.exports = router;
