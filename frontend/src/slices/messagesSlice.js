import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
//import fetchInitialData from '../context/InitialDataThunk';
import { removeChannel as channelActions } from './channelsSlice';

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
    builder.addCase(channelActions.removeChannel, (state, action) => {
      const currentChannelId = action.payload;
      const mapessagesIds = Object.values(state.entities)
        .filter((e) => e.channelId === currentChannelId)
        .map(({ id }) => id);
      messagesAdapter.removeMany(state, mapessagesIds);
    });
  },
});

export const { addMessage } = messageSlice.actions;
export { messagesAdapter };
export default messageSlice.reducer;
