import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    type: String,
    message: String,
    senderName: String,
    senderId: String
});

const Chat = mongoose.model('chats', ChatSchema);

export default Chat;
