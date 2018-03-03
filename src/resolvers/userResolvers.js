import { PubSub, withFilter } from 'graphql-subscriptions';

const pubsub = new PubSub();

export default {
    Query: {
        allUsers: async (parent, args, { User }) => {
            return await User.find();
        },
        getUser: async (parent, { id }, { User }) => {
            return await User.findOne({ '_id': id}).catch(err => null);
        }
    },
    Mutation: {
        createUser: async (parent, args, { User }) => {
            let user = await new User(args);
            pubsub.publish('userAdded', { userAdded: user });
            return await user.save();
        },
        removeUser: async (parent, { id }, { User }) => {
            let user = await User.findOne({ '_id': id}).catch(err => null);
            if (user == null) return null;
            pubsub.publish('userRemoved', user);
            return await user.remove();
        },
        addChatRoom: async (parent, { userId, chatRoomId }, { User }) => {
            let user = await User.findOne({ '_id': id}).catch(err => null);
            if (user == null) return null;
            let index = user.chatsList.indexOf(chatRoomId);
            if (index == -1)
                user.chatsList.push(chatRoomId);
            return await user.save();            
        },
        removeChatRoom: async (parent, { userId, chatRoomId }, { User }) => {
            let user = await User.findOne({ '_id': id}).catch(err => null);
            if (user == null) return null;
            let index = user.chatsList.indexOf(chatRoomId);
            if (index != -1)
                user.chatsList.splice(index, 1);
            return await user.save();            
        }
    }, 
    Subscription: {
        userAdded: {
            subscribe: () => pubsub.asyncIterator('userAdded')
        },
        userRemoved: {
            subscribe: () => pubsub.asyncIterator('userAdded')
        }
    }
}