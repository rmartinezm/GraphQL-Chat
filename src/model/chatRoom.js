import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ChatRoomSchema = new Schema({
    name: String,
    usersList: [String],
    chatList: [String]
});

const ChatRoom = mongoose.model('chat-rooms', ChatRoomSchema);

export default ChatRoom;