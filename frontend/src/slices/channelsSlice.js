/* eslint-disable no-param-reassign */
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import fetchInitialData from './InitialDataThunk';

const channelsAdapter = createEntityAdapter();
const defaultCurrentChannelId = 1;
const initialState = channelsAdapter.getInitialState({
  currentChannelId: defaultCurrentChannelId,
  loadingState: 'notLoaded', // Добавлено состояние загрузки
});

const channelSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,
    setCurrentChannel: (state, { payload }) => {
      state.currentChannelId = payload;
    },
    removeChannel: (state, { payload }) => {
      if (state.currentChannelId === payload) {
        state.currentChannelId = defaultCurrentChannelId;
      }
      channelsAdapter.removeOne(state, payload);
    },
    renameChannel: channelsAdapter.updateOne,
    setLoadingState: (state, { payload }) => {
      state.loadingState = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.pending, (state) => {
        state.loadingState = 'loading';
      })
      .addCase(fetchInitialData.fulfilled, (state, { payload }) => {
        channelsAdapter.setAll(state, payload.channels);
        state.currentChannelId = payload.currentChannelId;
        state.loadingState = 'successful';
      })
      .addCase(fetchInitialData.rejected, (state, { payload }) => {
        if (payload === 401) {
          state.loadingState = 'authError';
        } else {
          state.loadingState = 'failed';
        }
      });
  },
});

export const {
  addChannel,
  setCurrentChannel,
  removeChannel,
  renameChannel,
  setLoadingState, // Новый экшен для установки состояния загрузки
} = channelSlice.actions;
export { channelsAdapter };
export default channelSlice.reducer;
