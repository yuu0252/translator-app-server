import { Response } from "express";
import Category from "../models/Category";
import Phrase from "../models/Phrase";

export const category = {
  // カテゴリの新規作成
  create: async (req: any, res: Response) => {
    const { title } = req.body;
    try {
      if (title.replace(/\r?\n/g, "") === "")
        return res.status(400).json("タイトルは必須項目です");

      const category = await Category.create({
        user: req.user._id,
        title: req.body.title,
      });
      res.status(201).json(category);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  getAll: async (req: any, res: Response) => {
    try {
      const categories = await Category.find({ user: req.user._id });

      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getOne: async (req: any, res: Response) => {
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
  update: async (req: any, res: Response) => {
    const { categoryId } = req.params;
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
  delete: async (req: any, res: Response) => {
    const { categoryId } = req.params;
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
