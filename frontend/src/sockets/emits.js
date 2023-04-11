/* eslint-disable consistent-return, no-console */
import { toast } from 'react-toastify';
import { socket } from './index';
import store from "../slices/index";
import { setCurrentChannel } from "../slices/channelsSlice";

const showToaster = (status) => {
  switch (status) {
    case 'add':
      toast.success(`Канал создан`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      break;
    case 'rename':
      toast.success(`Канал переименован`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      break;
    case 'remove':
      toast.success(`Канал удалён`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      break;
    case 'error':
      toast.error(`Ошибка соединения`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      break;
    default:
      return `Unexpected toaster status: ${status}`;
  }
};

const emitNewMessage = (message, activeChannel, username) => {
  socket
    .timeout(5000)
    .emit('newMessage', { body: message, channelId: activeChannel, username }, (err, response) => {
      if (!response || err) {
        showToaster('error');
      } else {
        console.log(response.data.id)
        store.dispatch(setCurrentChannel(response.data.id))
      }
    });
};

const emitNewChannel = (name) => new Promise((resolve, reject) => {
  socket.timeout(5000).emit('newChannel', { name }, (err, response) => {
    if (!response || err) {
      showToaster('error');
      reject();
    } else {
      showToaster('add');
      resolve(response.data.id);
    }
  });
}) 

const emitRemoveChannel = (extra) => {
  socket.timeout(5000).emit('removeChannel', { id: extra }, (err, response) => {
    if (!response || err) {
      showToaster('error');
    } else {
      showToaster('remove');
    }
  });
};

const emitRenameChannel = (id, name) => {
  socket.timeout(5000).emit('renameChannel', { id, name }, (err, response) => {
    if (!response || err) {
      showToaster('error');
    } else {
      showToaster('rename');
    }
  });
};

export { emitNewMessage, emitNewChannel, emitRemoveChannel, emitRenameChannel };
