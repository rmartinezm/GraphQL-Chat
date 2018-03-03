import express from 'express';
import mongoose from 'mongoose';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { makeExecutableSchema, mergeSchemas } from 'graphql-tools';
import User from './model/user';
import userTypeDefs from './schemas/userSchema';
import userResolvers from './resolvers/userResolvers';
import ChatRoom from './model/chatRoom';
import chatRoomTypeDefs from './schemas/chatRoomSchema';
import chatRoomResolvers from './resolvers/chatRoomResolver';
import Chat from './model/chat';
import chatTypeDefs from './schemas/chatSchema';
import chatResolvers from './resolvers/chatResolver';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';

var cors = require('cors');

const app = express();
mongoose.connect('mongodb://localhost/exampleDatabase').then( 
    (res) => {
        console.log('MongoDB Connected');
}).catch(
    (err) => {
        console.log(err); 
});
 
// Express Configurations
app.set('port', process.env.PORT || 3300);

// Schemas
const userSchema = makeExecutableSchema({
    typeDefs: userTypeDefs,
    resolvers: userResolvers
});
const chatRoomSchema = makeExecutableSchema({
    typeDefs: chatRoomTypeDefs,
    resolvers: chatRoomResolvers
});
const chatSchema = makeExecutableSchema({
    typeDefs: chatTypeDefs,
    resolvers: chatResolvers
});
// MainSchema
const schema = mergeSchemas({
    schemas: [userSchema, chatRoomSchema, chatSchema],
  });
// GraphQL Route
app.use(cors());
app.use('/graphql', express.json(), graphqlExpress({
    schema,
    context: {
        User,
        Chat,
        ChatRoom
    }
}));

const server = createServer(app);
// Launch Server
server.listen(app.get('port'), () => {
    console.log(`GraphQL Server is now running on http://localhost:${app.get('port')}`);
    new SubscriptionServer({
      execute,
      subscribe,
      schema,
    }, {
      server,
      path: '/subscriptions',
    });
});