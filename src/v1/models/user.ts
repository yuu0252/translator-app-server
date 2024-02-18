import mongoose from 'mongoose';

interface IUser {
  username: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const User = mongoose.model<IUser>('User', userSchema);
export default User;
