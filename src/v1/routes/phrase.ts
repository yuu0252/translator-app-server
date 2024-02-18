import { Router } from 'express';
import { verifyToken } from '../middleWare/tokenHandler';
import { phrase } from '../controller/phrase';

const router = Router();

// フレーズの新規作成
router.post('/', verifyToken, phrase.create);
// ユーザのフレーズを取得
router.get('/', verifyToken, phrase.getAll);
// フレーズを編集
router.put('/:phraseId', verifyToken, phrase.update);

module.exports = router;
