import { createSlice } from '@reduxjs/toolkit';

const messagesSlice = createSlice({
name: 'messages',
 initialState: {
        messages: []
},

reducers: {
    getMessages(state, action) {
        const message = action.payload
        console.log(message)
        state.messages.push(message)
    },
}
})

export const {getMessages} = messagesSlice.actions;

export default messagesSlice.reducer;