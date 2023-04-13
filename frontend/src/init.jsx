import i18n from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import App from './App';
import store from './slices/index';
import { getMessages } from './slices/messagesSlice';
import {
  addNewChannel,
  renameChannel,
  removeChannel,
} from './slices/channelsSlice';
import 'react-toastify/dist/ReactToastify.css';
import ru from './locales/ru/translation';
import { socket } from './sockets';

const InitApp = () => {
  socket.on('newMessage', (payload) => {
    store.dispatch(getMessages(payload));
  });
  socket.on('newChannel', (payload) => {
    store.dispatch(addNewChannel(payload));
  });
  socket.on('renameChannel', (payload) => {
    store.dispatch(renameChannel(payload));
  });
  socket.on('removeChannel', (payload) => {
    store.dispatch(removeChannel(payload));
  });

  const i18nInstace = i18n.createInstance();

  i18nInstace.use(initReactI18next).init({
    fallbackLng: 'ru',
    resources: {
      ru,
    },
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });
  return (
    <I18nextProvider i18n={i18nInstace}>
      <App />
    </I18nextProvider>
  );
};
export default InitApp;
