import mongoose from "mongoose";

const Schema = mongoose.Schema;

interface ICategory {
  user: string;
  title: String;
}

const categorySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model<ICategory>("Category", categorySchema);
export default Category;
