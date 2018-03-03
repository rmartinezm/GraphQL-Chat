import { PubSub, withFilter } from 'graphql-subscriptions';

const pubsub = new PubSub();

export default {
    Query: {
        allChatRooms: async (parent, args, { ChatRoom }) => {
            return await ChatRoom.find();
        },
        getChatRoom: async (parent, { id }, { ChatRoom }) => {
            return await ChatRoom.findOne({'_id': id}).catch(err => null);
        },
        allChatsForThisChatRoom: async (parent, { chatRoomId }, { ChatRoom }) => {
            let chatRoom = await ChatRoom.findOne({'_id': chatRoomId}).catch(err => null);
            if (chatRoom == null) return null;
            return chatRoom.chatsList;
        },
        allUsersForThisChatRoom: async (parent, { chatRoomId }, { ChatRoom }) => {
            let chatRoom = await ChatRoom.findOne({'_id': chatRoomId}).catch(err => null);
            if (chatRoom == null) return null;
            return chatRoom.usersList;
        }
    },
    Mutation: {
        createChatRoom: async (parent, { name }, { ChatRoom }) => {
            let chatRoom = new ChatRoom();
            chatRoom.name = name;
            return await chatroom.save();
        },
        removeChatRoom: async (parent, { id }, { ChatRoom }) => {
            let chatRoom = await ChatRoom.findOne({'_id': id}).catch(err => null);
            if (chatRoom == null) return null;
            return await chatRoom.remove();
        },
        addUserToChatRoom: async (parent, { userId, chatRoomId }, { ChatRoom }) => {
            let chatRoom = await ChatRoom.findOne({'_id': chatRoomId}).catch(err => null);
            if (chatRoom == null) return null;
            if (chatRoom.usersList.indexOf(userId) < 0){
                chatRoom.usersList.push(userId);
                pubsub.publish('userAddedToThisChatRoom', { userAddedToThisChatRoom: userId });
            }
            return await chatRoom.save();
        },
        removeUserFromChatRoom: async (parent, { userId, chatRoomId }, { ChatRoom }) => {
            let chatRoom = await ChatRoom.findOne({'_id': chatRoomId}).catch(err => null);
            if (chatRoom == null) return null;
            let index = chatRoom.usersList.indexOf(userId);
            if (index > -1){
                chatRoom.usersList.splice(index, 1);
                pubsub.publish('userRemovedFromThisChatRoom', { userRemovedFromThisChatRoom: userId });
            }
            return await chatRoom.save();
        },
        addChatToThisChatRoom: async (parent, { chatId, chatRoomId }, { ChatRoom }) => {
            let chatRoom = await ChatRoom.findOne({'_id': chatRoomId}).catch(err => null);
            if (chatRoom == null) return null;
            if (chatRoom.usersList.indexOf(chatId) < 0){
                chatRoom.usersList.push(chatId);
                pubsub.publish('chatAddedToThisChatRoom', { chatAddedToThisChatRoom: chatId });
            }
            return await chatRoom.save();
        },
    },
    Subscription: {
        userAddedToThisChatRoom: {
            subscribe: withFilter( () => pubsub.asyncIterator('userAddedToThisChatRoom'), (payload, variables) => {
                console.log(payload);
                console.log(variables);
                return true;
            })
        },
        userRemovedFromThisChatRoom: {
            subscribe: withFilter( () => pubsub.asyncIterator('userRemovedFromThisChatRoom'), (payload, variables) => {
                console.log(payload);
                console.log(variables);
                return true;
            })
        },
        chatAddedToThisChatRoom: {
            subscribe: withFilter( () => pubsub.asyncIterator('chatAddedToThisChatRoom'), (payload, variables) => {
                console.log(payload);
                console.log(variables);
                return true;
            })
        },
    }
}