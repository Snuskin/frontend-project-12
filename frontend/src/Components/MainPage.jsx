import {setInitialChannels, setCurrentChannel, addNewChannel} from '../slices/channelsSlice';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {getMessages} from '../slices/messagesSlice';
import { combineReducers } from '@reduxjs/toolkit';
import AddChannelModal from './AddChannelModal';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/index.jsx';
import { io } from "socket.io-client";
import routes from '../routes.js';
import initSockets from '../init';
import cn from 'classnames';
import axios from 'axios';



const socket = io("http://localhost:5001");

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }
  return {};
};



const emitNewMessage = (message, activeChannel) => {
socket.emit('newMessage', { body: message, channelId: activeChannel, username: 'admin' });
}

 const MainPage = () => {

  const userChannels = useSelector((state) => state.channels.channelsInfo.channels);
  const userMessages = useSelector((state) => state.messages.messages);
  const currentChannel = useSelector((state) => state.channels.channelsInfo.currentChannelId);
  const [modalActive, setModalActive] = useState(false)
  const [messageText, setMessageText] = useState('');
  const [activeChannel, setActiveChannel] = useState('1')
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useAuth();

  const logOut = () => {
  auth.logOut();
};

const inputRef = useRef(null)

const onClear = () => {
  inputRef.current.value = "";
};


  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await axios.get(routes.usersPath(), { headers: getAuthHeader() });
      data ? dispatch(setInitialChannels(data)) : navigate('/login')
      initSockets()
    };
    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addMessages = () => {
    return (
      <>
      {
        userMessages
        .filter((message) => message.channelId == activeChannel)
        .map((message) =>
      <div className='message-body' key={message.id}>
      <b>{message.username}</b>: {message.body}
      </div>
        )
    }
    </>  
    )
  };
  const renderChangedChannel = (e) => {
    console.log(e.target.id)
    dispatch(setCurrentChannel(e.target.id));
    setActiveChannel(e.target.id);
  };

  const renderInitChannels = () => {
    return (
      <ul>
        {
        userChannels.map((channel) => 
        <li key={channel.id}>
          <button type='button' id={channel.id} onClick={(e) => renderChangedChannel(e)} className={channelBtnClasses(channel.id)}>{channel.name}</button>
        </li>)
        }
      </ul>
    )
  }; 
 const renderNewChannel = () => {
  alert('ku')
  }
  const handleSubmit = (e) => {
    emitNewMessage(messageText, activeChannel)
    e.preventDefault();
  };

const channelBtnClasses = (id) => cn({
  btn: true,
  "channel-btn": true,
  "active": activeChannel == id
});
  return (
    <>
    <div className='mainpage-container'>
      <nav className='chat-navbar'>
        <a href="https://github.com/Snuskin" target='_blank'>SnusChat</a>
        <button onSubmit={() => logOut()}>Выйти</button>
      </nav>
      <div className='chat-container'>
        <div className='channels-list'>
          <div className='channels-list-header'>
            <b>Каналы</b>
            <button type='button' onClick={() => setModalActive(true)} className='add-channel-btn'>+</button>
          </div>
            {renderInitChannels()}
        </div>
        <div className='chat-space'>
          <div className='picked-channel'></div>
          <div className='messages-area'>
            {addMessages()}
          </div>
          <form noValidate onSubmit={handleSubmit} className='chat-form'>
            <input ref={inputRef} type="text" onChange={(e) => setMessageText(e.target.value)} placeholder="Введите сообщение..." className='chat-input'/>
            <button onClick={onClear} className='submit-message-btn btn'  type='submit'>
              Отправить
            </button>
          </form>
        </div>
      </div>
      <AddChannelModal active={modalActive} setActive={setModalActive} />
    </div>
    </>
  )
} 
export default MainPage