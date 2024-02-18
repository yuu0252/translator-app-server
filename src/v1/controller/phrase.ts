import { Response } from 'express';
import { Phrase } from '../models/Phrase';

// フレーズの新規作成
export const createPhrase = async (req: any, res: Response) => {
  try {
    const phrase = await Phrase.create({
      user: req.user._id,
      title: req.body.title,
    });
    res.status(201).json(phrase);
  } catch (err) {
    res.status(500).json(err);
  }
};
