import { Request, Response } from "express";
import Phrase from "../models/phrase";

export const phrase = {
  // フレーズの新規作成
  create: async (req: Request, res: Response) => {
    try {
      const { title } = req.body;
      const { categoryId } = req.params;

      if (!/^[0-9a-fA-F]{24}$/.test(categoryId)) {
        return res.status(400).json("カテゴリIDが無効です");
      }

      if (title.replace(/\r?\n/g, "") === "")
        return res.status(400).json("タイトルは必須項目です");

      const isExist = await Phrase.findOne({
        user: req.user._id,
        category: categoryId,
        title: title,
      });

      if (isExist)
        return res.status(409).json("同じフレーズがすでに存在します");

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
  // 指定されたカテゴリのフレーズをすべて取得
  getAll: async (req: Request, res: Response) => {
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
  // あるカテゴリのフレーズに存在すればそのフレーズを返す
  checkExist: async (req: Request, res: Response) => {
    try {
      const { title } = req.body;
      const phrases = await Phrase.find({
        user: req.user._id,
        title: title,
      });
      res.status(200).json(phrases);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // IDで指定されたフレーズを更新
  update: async (req: Request, res: Response) => {
    try {
      const { categoryId, phraseId } = req.params;

      if (!/^[0-9a-fA-F]{24}$/.test(categoryId)) {
        return res.status(400).json("カテゴリIDが無効です");
      }

      if (!/^[0-9a-fA-F]{24}$/.test(phraseId)) {
        return res.status(400).json("フレーズIDが無効です");
      }

      const { title } = req.body;
      if (title.replace(/\r?\n/g, "") === "")
        return res.status(400).json("タイトルは必須項目です");

      const isExist = await Phrase.findOne({
        user: req.user._id,
        category: categoryId,
        title: title,
      });

      if (isExist)
        return res.status(409).json("同じフレーズがすでに存在します");

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
  // IDで指定されたフレーズを削除
  delete: async (req: Request, res: Response) => {
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
