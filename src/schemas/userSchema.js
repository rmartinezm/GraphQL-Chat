export default `
    
    type User {
        _id: String!
        email: String!
        password: String!
        username: String!
        chatsList: [String!]!
    }    

    type Query {
        allUsers: [User!]!
        getUser(id:String!): User
    }

    type Mutation {
        createUser(email:String!, password:String!, username:String!): User!
        removeUser(id:String!): User
        addChatRoom(userId:String!, chatRoomId:String!): User
        removeChatRoom(userId:String!, chatRoomId:String!): User
    }

    type Subscription {
        userAdded: User!
        userRemoved: User!
    }

`;