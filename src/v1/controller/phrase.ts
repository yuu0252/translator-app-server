import { Response } from 'express';
import { Phrase } from '../models/Phrase';

export const phrase = {
  // フレーズの新規作成
  create: async (req: any, res: Response) => {
    const { title } = req.body;
    try {
      if (title.replace(/\r?\n/g, '') === '')
        return res.status(400).json('タイトルは必須項目です');

      const phrase = await Phrase.create({
        user: req.user._id,
        title: req.body.title,
      });
      res.status(201).json(phrase);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getAll: async (req: any, res: Response) => {
    try {
      const phrases = await Phrase.find({ user: req.user._id });
      res.status(200).json(phrases);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  update: async (req: any, res: Response) => {
    const { phraseId } = req.params;
    const { title } = req.body;
    try {
      if (title.replace(/\r?\n/g, '') === '')
        return res.status(400).json('タイトルは必須項目です');

      const phrase = await Phrase.findOne({
        user: req.user._id,
        _id: phraseId,
      });
      if (!phrase) return res.status(404).json('フレーズが存在しません');

      const updatedPhrase = await Phrase.findByIdAndUpdate(phraseId, {
        $set: req.body,
      });

      res.status(200).json(updatedPhrase);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  delete: async (req: any, res: Response) => {
    const { phraseId } = req.params;
    try {
      const phrase = await Phrase.findOne({ _id: phraseId });
      if (!phrase) return res.status(400).json('フレーズが存在しません');

      await Phrase.deleteOne({ _id: phraseId });
      res.status(200).json('フレーズを削除しました');
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
