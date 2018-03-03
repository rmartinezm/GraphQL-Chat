export default `
    type Chat {
        _id: String!
        type: String!
        message: String!
        senderName: String!
        senderId: String!
    }

    type Query {
        allChats: [Chat!]!
    }

    type Mutation {
        createChat(type:String!, message:String!, senderName:String!, senderId:String!): Chat!
    }
`;