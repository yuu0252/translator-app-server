import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectToDatabase } from "./src/v1/controller/connectToDatabase";

const app = express();
const PORT = 8000;

app.use(express.json());

// 認証API
const authRouter = require("./src/v1/routes/auth");

app.use("/api/v1", authRouter);

// DB接続
connectToDatabase();

app.listen(PORT, () => {
  console.log("ローカルサーバ起動中");
});
