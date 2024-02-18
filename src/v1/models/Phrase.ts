import mongoose from 'mongoose';
const Schema = mongoose.Schema;

interface IPhrase {
  user: string;
  title: string;
}

const phraseSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model<IPhrase>('Phrase', phraseSchema);
