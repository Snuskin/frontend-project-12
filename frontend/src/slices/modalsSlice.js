import { createSlice } from '@reduxjs/toolkit';

const modalsSlice = createSlice({
name: 'modals',
 initialState: {
        modal: {
            isOpenend: false,
            type: null,
            extra: null
        }
},

reducers: {
    openModal(state, action) {
        console.log(action)
        state.modal.isOpenend = true;
        state.modal.type = action.payload.type
        action.payload.extra ? state.modal.extra = action.payload.extra :  state.modal.extra = null
    },
    closeModal(state) {
        state.modal.isOpenend  = false;
        state.modal.type = null;
        state.modal.extra = null;
    }
},
})

export const {openModal, closeModal} = modalsSlice.actions;

export default modalsSlice.reducer;