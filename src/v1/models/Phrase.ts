import mongoose from "mongoose";
const Schema = mongoose.Schema;

interface IPhrase {
  user: string;
  category: string;
  title: string;
}

const phraseSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Catergory",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const Phrase = mongoose.model<IPhrase>("Phrase", phraseSchema);
export default Phrase;
