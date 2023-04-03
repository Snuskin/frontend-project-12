import App from "./App";
import store from "./slices/index";
import { getMessages } from "./slices/messagesSlice";
import {
  addNewChannel,
  renameChannel,
  removeChannel,
  setCurrentChannel,
} from "./slices/channelsSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ru from "./locales/ru/translation";
import { socket } from "./sockets";
const InitApp = () => {
  i18n.use(initReactI18next).init({
    fallbackLng: "ru",
    resources: {
      ru,
    },
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

  try {
    socket.on("newMessage", (payload) => {
      store.dispatch(getMessages(payload));
    });
    socket.on("newChannel", (payload) => {
      store.dispatch(addNewChannel(payload));
      store.dispatch(setCurrentChannel(payload.id));
    });
    socket.on("renameChannel", (payload) => {
      store.dispatch(renameChannel(payload));
    });
    socket.on("removeChannel", (payload) => {
      store.dispatch(removeChannel(payload));
      store.dispatch(setCurrentChannel(1));
    });
  } catch (e) {
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
  return <App />;
};
export default InitApp;
