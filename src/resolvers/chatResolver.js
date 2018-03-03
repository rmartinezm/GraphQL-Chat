export default {
    Query: {
        allChats: async (parent, args, { Chat }) => {
            return [];
        }
    },
    Mutation: {
        createChat: async (parent, args, { Chat }) => {
            return await new Chat(args);
        }
    }
}