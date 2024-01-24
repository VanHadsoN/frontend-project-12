/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { actions as loadingStatusActions } from './loadingStatusSlice.js';
import fetchInitialData from './thunk';

const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState({
  currentChannelId: null,
});

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannels: channelsAdapter.addMany,
    addChannel: channelsAdapter.addOne,
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
    removeChannel: (state, { payload }) => {
      if (state.currentChannelId === payload) {
        const newCurrentChannelId = state.ids[0];
        state.currentChannelId = newCurrentChannelId;
      }
      channelsAdapter.removeOne(state, payload);
    },
    renameChannel: (state, { payload }) => {
      const channel = Object.values(state.entities).find(
        (c) => c.id === payload.id,
      );
      channel.name = payload.name;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.fulfilled, (state, { payload }) => {
        channelsAdapter.setAll(state, payload.channels);
        state.currentChannelId = payload.currentChannelId;
      })
      .addCase(loadingStatusActions.unload, () => initialState);
  },
});

const selectors = channelsAdapter.getSelectors((state) => state.channels);
const customSelectors = {
  selectAllChannels: selectors.selectAll,
  selectAllChannelsNames: (state) => {
    const { entities } = state.channels;
    return Object.values(entities).map(({ name }) => name);
  },
  selectCurrentChannel: (state) => {
    const { currentChannelId } = state.channels;
    return selectors.selectById(state, currentChannelId);
  },
};

const { actions } = channelsSlice;

export { actions, customSelectors as channelsSelectors };
export default channelsSlice.reducer;
