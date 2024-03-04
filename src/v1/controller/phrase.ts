import { Response } from "express";
import Phrase from "../models/Phrase";

export const phrase = {
  // フレーズの新規作成
  create: async (req: any, res: Response) => {
    const { title } = req.body;
    const { categoryId } = req.params;
    console.log(req.params);
    try {
      if (title.replace(/\r?\n/g, "") === "")
        return res.status(400).json("タイトルは必須項目です");

      const phrase = await Phrase.create({
        user: req.user._id,
        category: categoryId,
        title: title,
      });
      res.status(201).json(phrase);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getAll: async (req: any, res: Response) => {
    try {
      const { categoryId } = req.params;
      const phrases = await Phrase.find({ category: categoryId });
      res.status(200).json(phrases);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  checkExist: async (req: any, res: Response) => {
    try {
      const { title } = req.body;
      const phrases = await Phrase.find({
        user: req.user_id,
        title: title,
      });
      res.status(200).json(phrases);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  update: async (req: any, res: Response) => {
    const { categoryId, phraseId } = req.params;
    const { title } = req.body;
    try {
      if (title.replace(/\r?\n/g, "") === "")
        return res.status(400).json("タイトルは必須項目です");

      const phrase = await Phrase.findOne({
        category: categoryId,
        id: phraseId,
      });
      if (!phrase) return res.status(404).json("フレーズが存在しません");

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
      const phrase = await Phrase.findOne({ id: phraseId });
      if (!phrase) return res.status(400).json("フレーズが存在しません");

      await Phrase.deleteOne({ id: phraseId });
      res.status(200).json("フレーズを削除しました");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
