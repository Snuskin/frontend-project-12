import { configureStore } from '@reduxjs/toolkit';
import channelsSlice from './channelsSlice';
import messagesSlice from './messagesSlice';
import modalsSlice from './modalsSlice';

export default configureStore({
  reducer: {
    channels: channelsSlice,
    messages: messagesSlice,
    modals: modalsSlice,
  },
});
