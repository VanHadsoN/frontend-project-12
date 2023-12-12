import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import fetchInitialData from './InitialDataThunk';
import { removeChannel } from './channelsSlice';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeChannel, (state, action) => {
        const currentChannelId = action.payload;
        const mapessagesIds = Object.values(state.entities)
          .filter((message) => message.channelId === currentChannelId)
          .map(({ id }) => id);
        messagesAdapter.removeMany(state, mapessagesIds);
      })
      .addCase(fetchInitialData.fulfilled, (state, { payload }) => {
        messagesAdapter.setAll(state, payload.messages);
      });
  },
});

export const { addMessage, addMessages } = messageSlice.actions;
export { messagesAdapter };
export default messageSlice.reducer;
