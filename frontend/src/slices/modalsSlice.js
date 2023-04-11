/* eslint-disable no-param-reassign, no-unused-expressions */
import { createSlice } from '@reduxjs/toolkit';

const modalsSlice = createSlice({
  name: 'modals',
  initialState: {
    isOpenend: false,
    type: null,
    extra: null,
  },

  reducers: {
    openModal(state, action) {
      state.isOpenend = true;
      state.type = action.payload.type;
      action.payload.extra ? (state.extra = action.payload.extra) : (state.extra = null);
    },
    closeModal(state) {
      state.isOpenend = false;
      state.type = null;
      state.extra = null;
    },
  },
});

export const { openModal, closeModal } = modalsSlice.actions;

export default modalsSlice.reducer;
