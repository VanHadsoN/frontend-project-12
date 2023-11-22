import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import fetchInitialData from '../context/InitialDataThunk';
import { removeMessagesByChannel } from './channelsSlice';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,
    removeMessages: (state, { payload }) => {
      // Удаляем сообщения по массиву идентификаторов сообщений
      messagesAdapter.removeMany(state, payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInitialData.fulfilled, (state, { payload }) => {
      messagesAdapter.setAll(state, payload.messages);
    });
    // Добавляем обработку экшена removeMessagesByChannel из channelsSlice.js
    builder.addCase(removeMessagesByChannel, (state, { payload }) => {
      // Используем массив messagesToRemove из состояния каналов
      messagesAdapter.removeMany(state, payload.messagesToRemove);
    });
  },
});

export const { addMessage, removeMessages } = messageSlice.actions;
export { messagesAdapter };
export default messageSlice.reducer;
