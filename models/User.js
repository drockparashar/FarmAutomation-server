import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  polyhouses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Polyhouse' }]
});

const User = mongoose.model('User', userSchema);
export default User;
