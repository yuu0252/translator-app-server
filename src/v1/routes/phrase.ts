import { Router } from 'express';
import { verifyToken } from '../middleWare/tokenHandler';
import { createPhrase } from '../controller/phrase';

const router = Router();

// フレーズの新規作成
router.post('/', verifyToken, createPhrase);

module.exports = router;
