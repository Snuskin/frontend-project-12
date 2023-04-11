/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  channels: [],
  currentChannelId: null,
};
const channelsSlice = createSlice({
  name: 'channels',
  initialState,

  reducers: {
    setInitialChannels(state, action) {
      const user = action.payload;
      state.channels = user.channels;
      state.currentChannelId = 1;
    },
    setCurrentChannel(state, action) {
      state.currentChannelId = action.payload;
    },
    addNewChannel(state, action) {
      const channel = action.payload;
      state.channels.push({ ...channel, removable: true });
    },
    renameChannel(state, action) {
      const { id } = action.payload;
      const channelName = action.payload.name;
      const channel = state.channels.find((el) => el.id === id);
      channel.name = channelName;
    },
    removeChannel(state, action) {
      const { id } = action.payload;
      const lastofChannels = state.channels.filter((channel) => channel.id !== id);
      state.channels = lastofChannels;
    },
    resetChannelsReduser() {
      return initialState;
    },
  },
});

export const {
  setInitialChannels,
  setCurrentChannel,
  addNewChannel,
  renameChannel,
  removeChannel,
  resetChannelsReduser,
} = channelsSlice.actions;

export default channelsSlice.reducer;
