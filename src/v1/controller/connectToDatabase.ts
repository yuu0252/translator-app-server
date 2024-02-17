import mongoose from "mongoose";
import { serverEnv } from "../../../serverEnv";

// MongoDBと接続する
export const connectToDatabase = async () => {
  try {
    mongoose.connect(serverEnv.MONGODB_URL);
    console.log("DBとの接続に成功しました!");
  } catch (err) {
    console.log(err);
  }
};
