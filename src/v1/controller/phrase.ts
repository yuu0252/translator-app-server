import { Response } from "express";
import Phrase from "../models/Phrase";

export const phrase = {
  // フレーズの新規作成
  create: async (req: any, res: Response) => {
    const { title } = req.body;
    const { categoryId } = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(categoryId)) {
      return res.status(400).json("カテゴリIDが無効です");
    }

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

      if (!/^[0-9a-fA-F]{24}$/.test(categoryId)) {
        return res.status(400).json("カテゴリIDが無効です");
      }

      const phrases = await Phrase.find({
        user: req.user._id,
        category: categoryId,
      });
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

    if (!/^[0-9a-fA-F]{24}$/.test(categoryId)) {
      return res.status(400).json("カテゴリIDが無効です");
    }

    if (!/^[0-9a-fA-F]{24}$/.test(phraseId)) {
      return res.status(400).json("フレーズIDが無効です");
    }

    const { title } = req.body;
    try {
      if (title.replace(/\r?\n/g, "") === "")
        return res.status(400).json("タイトルは必須項目です");

      const phrase = await Phrase.findOne({
        user: req.user._id,
        category: categoryId,
        _id: phraseId,
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
    try {
      const { categoryId, phraseId } = req.params;

      if (!/^[0-9a-fA-F]{24}$/.test(categoryId)) {
        return res.status(400).json("カテゴリIDが無効です");
      }

      if (!/^[0-9a-fA-F]{24}$/.test(phraseId)) {
        return res.status(400).json("フレーズIDが無効です");
      }

      const phrase = await Phrase.findOne({
        user: req.user._id,
        _id: phraseId,
        category: categoryId,
      });
      if (!phrase) return res.status(400).json("フレーズが存在しません");

      await Phrase.deleteOne({
        user: req.user._id,
        _id: phraseId,
        category: categoryId,
      });
      res.status(200).json("フレーズを削除しました");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
