import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
// Apollo imports
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo';
// GraphQL Subscriptions
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { WebSocketLink } from 'apollo-link-ws';

const httpLink = new HttpLink({ uri: 'http://localhost:3300/graphql'});
const wsLink = new WebSocketLink({
    uri: 'ws:localhost:3300/subscriptions',
    options: {
        reconnect: true
    }
});
const link = split(
    ({query}) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink
);

const client = new ApolloClient({
    link,
    cache: new InMemoryCache().restore(window.__APOLLO_STATE__)
});


ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>, document.getElementById('root'));
registerServiceWorker();
