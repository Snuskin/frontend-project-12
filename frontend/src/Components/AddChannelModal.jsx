import React from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:5001");

const Modal = ({active, setActive}) => {
const emitNewChannel = (e) => {
    console.log(e.target)
    e.target.channelName.value.length > 0 ? socket.emit('newChannel', { name: e.target.channelName.value }) : setActive(true);
    setActive(false)
};

    return (
        <div className={active ? 'modal active' : 'modal'} onClick={() => setActive(false)}>
            <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
                <div>Добавить канал</div>
                <button className="modal-close-btn" onClick={() => setActive(false)}>X</button>
            </div>
            <div className="modal-body">
                <form onSubmit={emitNewChannel} id='add-modal-form' className="modal-form" action="">
                    <input name='channelName' type="text" />
                    <div className="modal-btns">
                        <button type="button" onClick={() => setActive(false)} className="cancel-btn">Отменить</button>
                        <button type="submit" className="commit-btn">Отправить</button>
                    </div>
                </form>
            </div>
            </div>
        </div>
    )
};

export default Modal