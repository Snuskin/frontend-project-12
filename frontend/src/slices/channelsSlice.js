import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    channelsInfo: {
        channels: [],
        currentChannelId: null
    },
}
const channelsSlice = createSlice({
name: 'channels',
 initialState,

reducers: {
    setInitialChannels(state, action) {
        const user = action.payload;
        const channels = user.channels;
        channels.forEach(element => state.channelsInfo.channels.push(element)); 
        state.channelsInfo.currentChannelId = user.currentChannelId
    },
    setCurrentChannel(state, action) {
        state.channelsInfo.currentChannelId = action.payload
    },
    addNewChannel(state, action) {
        const channel = action.payload;
        state.channelsInfo.channels.push({...channel, removable: true});
        state.channelsInfo.currentChannelId = channel.id;
    },
    renameChannel(state, action) {
        const id = action.payload.id;
        const channelName = action.payload.name;
        const newState = state.channelsInfo.channels;
        newState.find(el => el.id === id).name = channelName;
        state.channelsInfo.channels = newState
    },
    removeChannel(state, action) {
        const id = action.payload.id;
        const lastofChannels = state.channelsInfo.channels.filter(channel =>  channel.id !== id)
        state.channelsInfo.channels = lastofChannels
    },
    resetChannelsReduser(state, action) {
        return initialState
    },
}
})

export const {setInitialChannels, setCurrentChannel, addNewChannel, renameChannel, removeChannel, resetChannelsReduser} = channelsSlice.actions;

export default channelsSlice.reducer;

