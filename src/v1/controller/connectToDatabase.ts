import mongoose from "mongoose";

// MongoDBと接続する
export const connectToDatabase = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URL);
    console.log("DBとの接続に成功しました!");
  } catch (err) {
    console.log(err);
  }
};
