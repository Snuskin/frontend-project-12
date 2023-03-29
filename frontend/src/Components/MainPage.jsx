import {setInitialChannels, setCurrentChannel, resetChannelsReduser} from '../slices/channelsSlice';
import {resetMessagesReduser} from '../slices/messagesSlice';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AddChannelModal from './Modals';
import { useNavigate } from 'react-router-dom';
import {useAuth} from '../hooks/index.jsx';
import {emitNewMessage} from '../sockets/emits';
import routes from '../routes.js';
import cn from 'classnames';
import axios from 'axios';
import { openModal } from '../slices/modalsSlice';
import arrow from './../images/down-arrow.png';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }
  return {};
};

const sendNewMessage = (message, activeChannel) => {
console.log('ku')
const user = JSON.parse(localStorage.getItem('userId')).username;
emitNewMessage(message, activeChannel, user);
}

 const MainPage = () => {

  filter.add(filter.getDictionary('ru'))
  const { t } = useTranslation();
  const userChannels = useSelector((state) => state.channels.channelsInfo.channels);
  const userMessages = useSelector((state) => state.messages.messages);
  const currentChannel = useSelector((state) => state.channels.channelsInfo.currentChannelId);
  const [messageText, setMessageText] = useState('');
  const [activeChannel, setActiveChannel] = useState('1');
  const [contextOpen, setContextOpen] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useAuth();

  const logOut = (e) => {
  e.preventDefault()
  auth.logOut();
  dispatch(resetChannelsReduser())
  dispatch(resetMessagesReduser())
  navigate('/login')
};

const inputRef = useRef(null)

const onClear = () => {
  inputRef.current.value = "";
};


  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(routes.usersPath(), { headers: getAuthHeader() });
        dispatch(setInitialChannels(data))
      } catch(err) {
        if (err.isAxiosError && err.response.status === 401) {
          navigate('/login')
          return;
        }
      }
    };
    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addMessages = () => {
    return (
      <>
      {
        userMessages
        .filter((message) => message.channelId == currentChannel)
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
    dispatch(setCurrentChannel(e.target.id));
    setActiveChannel(e.target.id);
  };

  const renderInitChannels = () => {
    return (
      <ul>
        {
        userChannels.map((channel) => 
        <li key={channel.id}>
          {channel.removable === true ? 
          <div role='group' className='channel-cont' onClick={(e) => {e.stopPropagation()}}>
          <button type='button' id={channel.id} onClick={(e) => renderChangedChannel(e)} className={channelBtnClasses(channel.id)}>{`# ${channel.name}`}</button>
          <button name={`channel-${channel.id}`} onClick={() => contextOpen ? setContextOpen(null) : setContextOpen(channel.id)} style={{borderRadius: '50%'}}><img width='20' height='20' src={arrow}></img> </button>
          <div name={channel.id} className={openCtxtMenu(channel.id)}>
            <a name={channel.id} href="#" className='open-modal' onClick={(e) => {dispatch(openModal({isOpened: true, type: 'removeChannel', extra: e.target.name})); setContextOpen(null)}}>Удалить</a>
            <a name={channel.id} href="#" className='open-modal' onClick={(e) => {dispatch(openModal({isOpened: true, type: 'renameChannel', extra: e.target.name})); setContextOpen(null)}}>Переименовать</a>
          </div>
          </div>
          :<div role='group' className='channel-cont' onClick={(e) => {e.stopPropagation()}}>
          <button type='button' id={channel.id} onClick={(e) => renderChangedChannel(e)} className={channelBtnClasses(channel.id)}>{`# ${channel.name}`}</button>
          </div>
  }
        </li>)
        }
      </ul>
    )
  }; 
  const handleSubmit = (e) => {
    sendNewMessage(messageText, activeChannel)
    e.preventDefault();
  };
  const openCtxtMenu = (e) => {
     return cn('rename-remove-channel-container', {
        "show": contextOpen == e
      });
    
  } 

const channelBtnClasses = (id) => cn({
  btn: true,
  "channel-btn": true,
  "active": currentChannel == id
});
  return (
    <>
    <div className='mainpage-container'>
      <nav className='chat-navbar'>
        <div className='container'>
        <a href="https://github.com/Snuskin" target='_blank'>{t("mainPage.header.chatLink")}</a>
        <button type='button' onClick={(e) => logOut(e)}>{t("mainPage.header.logOutBtn")}</button>
        </div>
      </nav>
      <div className='chat-container'>
        <div className='channels-list'>
          <div className='channels-list-header'>
            <b>{t("mainPage.channelsListHeader")}</b>
            <button type='button' onClick={() => {dispatch(openModal({isOpened: true, type: 'addChannel'}))}} className='add-channel-btn'>+</button>
          </div>
            {renderInitChannels()}
        </div>
        <div className='chat-space'>
          <div className='picked-channel'></div>
          <div className='messages-area'>
            {addMessages()}
          </div>
          <form noValidate onSubmit={handleSubmit} className='chat-form'>
            <input ref={inputRef} type="text" onChange={(e) => setMessageText(filter.clean(e.target.value))} placeholder={t("mainPage.chatArea.inputPlaceholder")} className='chat-input'/>
            <button onClick={onClear} className='submit-message-btn btn'  type='submit'>
            {t("mainPage.chatArea.submitBtn")}
            </button>
          </form>
        </div>
      </div>
      <AddChannelModal  />
    </div>
    </>
  )
} 
export default MainPage