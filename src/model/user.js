import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: String,
    password: String,
    username: String,
    chatsList: [String]
});

const User = mongoose.model('users-chat', UserSchema);

export default User;
