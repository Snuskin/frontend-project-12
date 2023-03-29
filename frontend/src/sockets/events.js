import store from '../slices/index'
import {getMessages} from '../slices/messagesSlice';
import {addNewChannel, renameChannel, removeChannel, setCurrentChannel} from '../slices/channelsSlice';
import { socket } from "./index";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const socketEvents = () => {
  try {
    socket.on('newMessage', (payload) => {
      store.dispatch(getMessages(payload));
    });
  socket.on('newChannel', (payload) => {
    store.dispatch(addNewChannel(payload));
    store.dispatch(setCurrentChannel(payload.id));
    });
  socket.on('renameChannel', (payload) => {
      store.dispatch(renameChannel(payload));
    });
  socket.on('removeChannel', (payload) => {
    store.dispatch(removeChannel(payload));
    store.dispatch(setCurrentChannel(1));
    });
  } catch(e) {
    console.log(e)
    toast.error(`Ошибка соединения`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      });
  }
}