import { io } from "socket.io-client";
import store from './slices/index'
import {getMessages} from './slices/messagesSlice';
import {addNewChannel} from './slices/channelsSlice';

export default () => {
    const socket = io("http://localhost:5001");

    socket.on('newMessage', (payload) => {
        console.log(payload); 
        store.dispatch(getMessages(payload));
      });
    socket.on('newChannel', (payload) => {
      console.log(payload) // { id: 6, name: "new channel", removable: true }
      store.dispatch(addNewChannel(payload));
      });
}
