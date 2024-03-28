import { Request, Response } from "express";
import Category from "../models/category";

export const category = {
  // カテゴリの新規作成
  create: async (req: Request, res: Response) => {
    try {
      const { title } = req.body;
      if (title.replace(/\r?\n/g, "") === "")
        return res.status(400).json("タイトルは必須項目です");

      const isExist = await Category.findOne({
        user: req.user._id,
        title: req.body.title,
      });

      if (isExist)
        return res.status(409).json("このカテゴリ名は既に存在しています");

      const category = await Category.create({
        user: req.user._id,
        title: req.body.title,
      });

      res.status(201).json(category);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // カテゴリをすべて取得
  getAll: async (req: Request, res: Response) => {
    try {
      const categories = await Category.find({ user: req.user._id });

      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // IDで指定されたカテゴリを取得
  getOne: async (req: Request, res: Response) => {
    try {
      const category = await Category.findOne({
        user: req.user._id,
        title: req.body.title,
      });
      res.status(200).json(category);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // IDで指定されたカテゴリを更新
  update: async (req: Request, res: Response) => {
    const { categoryId } = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(categoryId)) {
      return res.status(400).json("カテゴリIDが無効です");
    }

    const { title } = req.body;
    try {
      if (title.replace(/\r?\n/g, "") === "")
        return res.status(400).json("タイトルは必須項目です");

      const category = await Category.findOne({
        user: req.user._id,
        _id: categoryId,
      });
      if (!category) return res.status(404).json("カテゴリーが存在しません");

      const updatedcategory = await Category.findByIdAndUpdate(categoryId, {
        $set: req.body,
      });

      res.status(200).json(updatedcategory);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // IDで指定されたカテゴリを削除
  delete: async (req: Request, res: Response) => {
    const { categoryId } = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(categoryId)) {
      return res.status(400).json("カテゴリIDが無効です");
    }

    try {
      const category = await Category.findOne({ _id: categoryId });
      if (!category) return res.status(400).json("カテゴリーが存在しません");

      await Category.deleteOne({ _id: categoryId });
      res.status(200).json("カテゴリーを削除しました");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
