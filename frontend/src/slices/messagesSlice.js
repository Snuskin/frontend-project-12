import { createSlice } from '@reduxjs/toolkit';
import {removeChannel} from './channelsSlice';
const initialState = {
    messages: []
}
const messagesSlice = createSlice({
name: 'messages',
 initialState,

reducers: {
    getMessages(state, action) {
        const message = action.payload
        state.messages.push(message)
    },
    extraReducers: (builder) => {
    builder.addCase(removeChannel, (state, action) => {
        const id = action.payload.id;
        const cleanedMessages = state.messages.filter(message => message.channelId !== id)
        state.messages = cleanedMessages
    })
    },
    resetMessagesReduser(state, action) {
        return initialState
    },
}
})

export const {getMessages, resetMessagesReduser} = messagesSlice.actions;

export default messagesSlice.reducer;