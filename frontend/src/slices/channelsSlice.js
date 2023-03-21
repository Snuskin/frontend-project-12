import { createSlice } from '@reduxjs/toolkit';
const channelsSlice = createSlice({
name: 'channels',
 initialState: {
    channelsInfo: {
        channels: [],
        currentChannelId: null
    },
},

reducers: {
    setInitialChannels(state, action) {
        const user = action.payload;
        const channels = user.channels;
        channels.forEach(element => {
            state.channelsInfo.channels.push(element)
        }); 
        state.channelsInfo.currentChannelId = user.currentChannelId
    },
    setCurrentChannel(state, action) {
        state.channelsInfo.currentChannelId = action.payload
    },
    addNewChannel(state, action) {
        const channel = action.payload;
        state.channelsInfo.channels.push(channel);
        state.channelsInfo.currentChannelId = channel.id;
    },
    getChangesOfChannels(state,action) {

    }
}
})

export const {setInitialChannels, setCurrentChannel, addNewChannel} = channelsSlice.actions;

export default channelsSlice.reducer;

