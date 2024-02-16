const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 8000;
require("dotenv").config();

app.use(express.json());

// DB接続
try {
  mongoose.connect(process.env.MONGODB_URL);
  console.log("DBとの接続に成功しました!");
} catch (err) {
  console.log(err);
}

app.get("/", (req, res) => {
  return res.status(200).json("GET");
});

app.listen(PORT, () => {
  console.log("ローカルサーバ起動中");
});
