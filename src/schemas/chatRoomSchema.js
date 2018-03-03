export default `

    type ChatRoom {
        _id: String!
        name: String!
        usersList: [String!]!,
        chatsList: [String!]!
    }

    type Query {
        allChatRooms: [ChatRoom!]!
        getChatRoom(id:String!): ChatRoom
        allChatsForThisChatRoom(chatRoomId:String!): [String!]        
        allUsersForThisChatRoom(chatRoomId:String!): [String!]  
    }

    type Mutation {
        createChatRoom(name:String!): ChatRoom!
        removeChatRoom(id:String!): ChatRoom
        addUserToChatRoom(userId:String!, chatRoomId:String!): ChatRoom        
        removeUserFromChatRoom(userId:String!, chatRoomId:String!): ChatRoom
        addChatToThisChatRoom(chatId:String!, chatRoomId:String!): ChatRoom        
    }

    type Subscription {
        chatRoomAdded: ChatRoom!
        chatRoomRemoved: ChatRoom!
        userAddedToThisChatRoom(chatRoomId:String!): String!
        userRemovedFromThisChatRoom(chatRoomId:String!): String!
        chatAddedToThisChatRoom(chatRoomId:String!): String!
    }

`;