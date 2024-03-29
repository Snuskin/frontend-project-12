/* eslint eqeqeq: "off", curly: "error" */
/* eslint-disable */

import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import {
  setCurrentChannel,
  resetChannelsReduser,
} from '../slices/channelsSlice';
import { resetMessagesReduser } from '../slices/messagesSlice';
import Modals from './Modals';
import { useAuth } from '../hooks/index.jsx';
import { emitNewMessage } from '../sockets/emits';
import { openModal } from '../slices/modalsSlice';
import arrow from '../images/down-arrow.png';

const sendNewMessage = (message, activeChannel) => {
  const user = JSON.parse(localStorage.getItem('userId')).username;
  emitNewMessage(message, activeChannel, user);
};

const MainPage = () => {
  filter.add(filter.getDictionary('ru'));
  const { t } = useTranslation();
  const userChannels = useSelector((state) => state.channels.channels);
  const userMessages = useSelector((state) => state.messages.messages);
  const currentChannel = useSelector(
    (state) => state.channels.currentChannelId,
  );
  const [messageText, setMessageText] = useState('');
  const [contextOpen, setContextOpen] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useAuth();

  const logOut = (e) => {
    e.preventDefault();
    auth.logOut();
    dispatch(resetChannelsReduser());
    dispatch(resetMessagesReduser());
    navigate('/login');
  };
  
  const channelBtnClasses = (id) => cn({
    btn: true,
    'channel-btn': true,
    active: currentChannel == id,
  });

  const inputRef = useRef(null);
  useEffect(() => {
    const inputEl = inputRef.current;
    inputEl.focus();
  }, []);
  const onClear = () => {
    inputRef.current.value = '';
  };

  const addMessages = () => (
    <>
      {userMessages
        .filter((message) => message.channelId == currentChannel)
        .map((message) => (
          <div className="message-body" key={message.id}>
            <b>{message.username}</b>
            :
            {message.body}
          </div>
        ))}
    </>
  );
  const renderChangedChannel = (e) => {
    dispatch(setCurrentChannel(e.target.id));
  };

  const renderInitChannels = () => (
    <ul>
      {userChannels.map((channel) => (
        <li key={channel.id}>
          {channel.removable === true ? (
            <div
              role="group"
              className="channel-cont"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <button
                type="button"
                id={channel.id}
                onClick={(e) => renderChangedChannel(e)}
                className={channelBtnClasses(channel.id)}
              >
                {`# ${channel.name}`}
              </button>
              <button
                name={`channel-${channel.id}`}
                onClick={() => (contextOpen
                  ? setContextOpen(null)
                  : setContextOpen(channel.id))}
                style={{ borderRadius: '50%' }}
              >
                <img width="20" height="20" src={arrow} />
                {' '}
                <span className="visually-hidden">Управление каналом</span>
              </button>
              <div name={channel.id} className={openCtxtMenu(channel.id)}>
                <a
                  name={channel.id}
                  href="#"
                  className="open-modal"
                  onClick={(e) => {
                    dispatch(
                      openModal({
                        isOpened: true,
                        type: 'removeChannel',
                        extra: e.target.name,
                      }),
                    );
                    setContextOpen(null);
                  }}
                >
                  Удалить
                </a>
                <a
                  name={channel.id}
                  href="#"
                  className="open-modal"
                  onClick={(e) => {
                    dispatch(
                      openModal({
                        isOpened: true,
                        type: 'renameChannel',
                        extra: e.target.name,
                      }),
                    );
                    setContextOpen(null);
                  }}
                >
                  Переименовать
                </a>
              </div>
            </div>
          ) : (
            <div
              role="group"
              className="channel-cont"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <button
                type="button"
                id={channel.id}
                onClick={(e) => renderChangedChannel(e)}
                className={channelBtnClasses(channel.id)}
              >
                {`# ${channel.name}`}
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    sendNewMessage(messageText, currentChannel);
  };
  const openCtxtMenu = (e) => cn('rename-remove-channel-container', {
    show: contextOpen == e,
  });

  return (
    <div className="mainpage-container">
      <nav className="chat-navbar">
        <div className="container">
          <a href="/">{t('mainPage.header.chatLink')}</a>
          <button type="button" onClick={(e) => logOut(e)}>
            {t('mainPage.header.logOutBtn')}
          </button>
        </div>
      </nav>
      <div className="chat-container">
        <div className="channels-list">
          <div className="channels-list-header">
            <b>{t('mainPage.channelsListHeader')}</b>
            <button
              type="button"
              onClick={() => {
                dispatch(openModal({ isOpened: true, type: 'addChannel' }));
              }}
              className="add-channel-btn"
            >
              +
            </button>
          </div>
          {renderInitChannels()}
        </div>
        <div className="chat-space">
          <div className="picked-channel" />
          <div className="messages-area">{addMessages()}</div>
          <form noValidate onSubmit={handleSubmit} className="chat-form">
            <div style={{ display: 'flex' }}>
              <input
                ref={inputRef}
                type="text"
                aria-label="Новое сообщение"
                onChange={(e) => setMessageText(filter.clean(e.target.value))}
                placeholder={t('mainPage.chatArea.inputPlaceholder')}
                className="chat-input"
              />
              <button
                onClick={onClear}
                className="submit-message-btn btn"
                type="submit"
                disabled={!(messageText.length > 0)}
              >
                {t('mainPage.chatArea.submitBtn')}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Modals />
    </div>
  );
};
export default MainPage;
