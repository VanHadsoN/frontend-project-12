/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { actions as loadingStatusActions } from './loadingStatusSlice.js';
import { actions as channelActions } from './channelsSlice';
import fetchInitialData from './thunk';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessages: messagesAdapter.addMany,
    addMessage: messagesAdapter.addOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.fulfilled, (state, { payload }) => {
        messagesAdapter.setAll(state, payload.messages);
      })
      .addCase(loadingStatusActions.unload, () => initialState)
      .addCase(channelActions.removeChannel, (state, { payload }) => {
        const restMessages = Object.values(state.entities).filter(
          (e) => e.channelId !== payload,
        );
        messagesAdapter.setAll(state, restMessages);
      });
  },
});

const selectors = messagesAdapter.getSelectors((state) => state.messages);
const customSelectors = {
  selectAllMessages: selectors.selectAll,
  selectCurrentChannelMessages: (state) => {
    const { currentChannelId } = state.channels;
    return selectors
      .selectAll(state)
      .filter(({ channelId }) => channelId === currentChannelId);
  },
};

const { actions } = messagesSlice;

export { actions, customSelectors as messagesSelectors };
export default messagesSlice.reducer;
