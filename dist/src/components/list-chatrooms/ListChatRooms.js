import React, { Component } from 'react';
import './ListChatRooms.css';
// GraphQL Imports
import { graphql } from 'react-apollo'
import gql from 'graphql-tag';
// Material UI
import Hidden from 'material-ui/Hidden';
import compose from 'recompose/compose';
import withWidth from 'material-ui/utils/withWidth';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';

class ListChatRooms extends Component {

    componentWillMount() {
        // ChatRoomAdded Subscription
        this.props.data.subscribeToMore({
            document: CHAT_ROOM_ADDED,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data.chatRoomAdded)
                    return prev;
                return Object.assign({}, prev, {
                    allChatRooms: [ ...prev.allChatRooms, subscriptionData.data.chatRoomAdded]
                });
            }
        });
        // ChatRoomRemoved Subscription
        this.props.data.subscribeToMore({
            document: CHAT_ROOM_REMOVED,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data.chatRoomRemoved)
                    return prev;
                let chatRoomRemoved = subscriptionData.data.chatRoomRemoved;
                let newArray = [];
                prev.allChatRooms.forEach(chatRoom => {
                  if (chatRoom._id !== chatRoomRemoved._id)
                    newArray.push(chatRoom);
                });
                return Object.assign({}, prev, {
                    allChatRooms: newArray
                });
            }
        });
    }

    render() {
        if (!this.props.data.allChatRooms || this.props.data.loading) 
            return (<div>Loading . . .</div>);
          if (this.props.data.error != null)
            return (<p>{this.props.data.error}</p>);
        return(
            <div>
                <p className="title"><b>All Chat Rooms</b></p>
                <Divider/>  
                <List>
                    {this.props.data.allChatRooms.map(chatRoom =>
                    <div key={chatRoom._id}>
                        <ListItem button onClick={this.chatRoomSelected.bind(this, chatRoom)}>
                        <ListItemText primary={chatRoom.name} />
                        </ListItem>
                        <Divider/>
                    </div>
                    )}
                </List>
            </div>
        );
    }

    chatRoomSelected(chatRoom){
        console.log(chatRoom);
    }

}

const ALL_CHAT_ROOMS = gql`
    query {
        allChatRooms {
            _id
            name
        }
    }
`;
const CHAT_ROOM_ADDED = gql`
    subscription {
        chatRoomAdded {
            _id
            name
        }
    }
`;
const CHAT_ROOM_REMOVED = gql`
    subscription {
        chatRoomRemoved {
            _id
            name
        }
    }
`;

const ListChatRoomsWithData = graphql(ALL_CHAT_ROOMS)(ListChatRooms);

export default ListChatRoomsWithData;