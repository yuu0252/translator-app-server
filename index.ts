import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectToDatabase } from "./src/v1/controller/connectToDatabase";
import cors from "cors";

const app = express();
const PORT = 8000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// 認証API
const authRouter = require("./src/v1/routes/auth");
app.use("/api/v1", authRouter);

// カテゴリAPI
const categoryRouter = require("./src/v1/routes/category");
app.use("/api/v1/categories", categoryRouter);

// フレーズAPI
const phraseRouter = require("./src/v1/routes/phrase");
app.use("/api/v1/phrases", phraseRouter);

// DB接続
connectToDatabase();

app.listen(PORT, () => {
  console.log("ローカルサーバ起動中");
});
