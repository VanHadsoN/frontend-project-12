/* eslint-disable no-param-reassign */
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const modalWindowAdapter = createEntityAdapter();
const initialState = modalWindowAdapter.getInitialState({
  isOpen: false,
  type: null,
  relevantChannel: null,
});

const modalWindowSlice = createSlice({
  name: 'modalWindow',
  initialState,
  reducers: {
    openModalWindow: (state, action) => {
      state.isOpen = true;
      state.type = action.payload.type;
      state.relevantChannel = action.payload.channelId;
    },
    closeModalWindow: (state) => {
      state.isOpen = false;
      state.type = null;
      state.relevantChannel = null;
    },
    setCurrentModalType: (state, { payload }) => {
      state.type = payload;
    },
    setRelevantChannel: (state, { payload }) => {
      state.relevantChannel = payload;
    },
  },
});

export const { actions } = modalWindowSlice;
export { modalWindowAdapter };
export default modalWindowSlice.reducer;
