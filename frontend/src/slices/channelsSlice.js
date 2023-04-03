import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  channels: [],
  currentChannelId: null,
};
const channelsSlice = createSlice({
  name: "channels",
  initialState,

  reducers: {
    setInitialChannels(state, action) {
      const user = action.payload;
      state.channels = user.channels;
      state.currentChannelId = user.currentChannelId;
    },
    setCurrentChannel(state, action) {
      state.currentChannelId = action.payload;
    },
    addNewChannel(state, action) {
      const channel = action.payload;
      state.channels.push({ ...channel, removable: true });
      state.currentChannelId = channel.id;
    },
    renameChannel(state, action) {
      const id = action.payload.id;
      const channelName = action.payload.name;
      const channel = state.channels.find((el) => el.id === id);
      channel.name = channelName;
    },
    removeChannel(state, action) {
      const id = action.payload.id;
      const lastofChannels = state.channels.filter(
        (channel) => channel.id !== id
      );
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
