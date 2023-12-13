/* eslint-disable no-param-reassign */
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const modalWindowAdapter = createEntityAdapter();
const initialState = modalWindowAdapter.getInitialState({
  isOpen: false,
  type: null,
  relevantChannel: null,
});
// eslint-disable-next-line
const closeModalWindow = (modalType = null) => ({ 
  type: 'CLOSE_MODAL_WINDOW',
  payload: { modalType },
});

const modalWindowSlice = createSlice({
  name: 'modalWindow',
  initialState,
  reducers: {
    openModalWindow: (state) => {
      state.isOpen = true;
    },
    closeModalWindow: (state, action) => {
      state.isOpen = false;
      state.currentModalType = action.payload.modalType;
    },
    setCurrentModalType: (state, action) => {
      state.currentModalType = action.payload;
    },
    setRelevantChannel: (state, { payload }) => {
      state.relevantChannel = payload;
    },
  },
});

export const { actions } = modalWindowSlice;
export { modalWindowAdapter };
export default modalWindowSlice.reducer;
