import { socket } from "./index";

const emitNewMessage = (message, activeChannel, username) => {
    socket.emit('newMessage', { body: message, channelId: activeChannel, username });
};

const emitNewChannel = (name) => {
        socket.emit('newChannel', { name: name });
};

const emitRemoveChannel = (extra) => {
    socket.emit('removeChannel', { id: extra })
};

const emitRenameChannel = (id, name) => {
    socket.emit('renameChannel', {id: id, name: name})
}; 

export {emitNewMessage, emitNewChannel, emitRemoveChannel, emitRenameChannel}
