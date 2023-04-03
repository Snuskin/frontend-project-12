import { socket } from "./index";
import { toast } from "react-toastify";

const showErrorToaster = () => {
  return toast.error(`Ошибка соединения`, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};

const emitNewMessage = (message, activeChannel, username) => {
  socket
    .timeout(5000)
    .emit(
      "newMessage",
      { body: message, channelId: activeChannel, username },
      (err, response) => {
        console.log(response);
        if (response.status === undefined || err) {
          showErrorToaster();
        }
      }
    );
};

const emitNewChannel = (name) => {
  socket.timeout(5000).emit("newChannel", { name: name }, (err, response) => {
    if (response.status === undefined || err) {
      showErrorToaster();
    }
  });
};

const emitRemoveChannel = (extra) => {
  socket.timeout(5000).emit("removeChannel", { id: extra }, (err, response) => {
    if (response.status === undefined || err) {
      showErrorToaster();
    }
  });
};

const emitRenameChannel = (id, name) => {
  socket
    .timeout(5000)
    .emit("renameChannel", { id: id, name: name }, (err, response) => {
      if (response.status === undefined || err) {
        showErrorToaster();
      }
    });
};

export { emitNewMessage, emitNewChannel, emitRemoveChannel, emitRenameChannel };
