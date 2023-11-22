import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import fetchInitialData from '../context/InitialDataThunk';

const channelsAdapter = createEntityAdapter();
const defaultCurrentChannelId = 1;
const initialState = channelsAdapter.getInitialState({
  currentChannelId: defaultCurrentChannelId,
  loadingState: 'notLoaded',
  messagesToRemove: [], // Добавляем новый массив для хранения сообщений, подлежащих удалению
});

const channelSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,
    setCurrentChannel: (state, { payload }) => {
      state.currentChannelId = payload;
    },
    // Модифицируем removeChannel, чтобы добавлять сообщения для удаления
    removeChannel: (state, { payload }) => {
      if (state.currentChannelId === payload) {
        state.currentChannelId = defaultCurrentChannelId;
      }
      const messagesToRemove = state.entities[payload]?.messages || [];
      state.messagesToRemove = messagesToRemove;
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
  setLoadingState,
} = channelSlice.actions;
export const { removeMessagesByChannel } = channelSlice.actions;
export { channelsAdapter };
export default channelSlice.reducer;
