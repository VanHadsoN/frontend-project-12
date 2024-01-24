/* eslint import/no-cycle: [2, { maxDepth: 1 }] */
import { createSlice } from '@reduxjs/toolkit';
import fetchInitialData from './thunk.js';

const initialState = {
  serverData: 'notLoaded',
};

const loadingStatusSlice = createSlice({
  name: 'loadingStatus',
  initialState,
  reducers: {
    unload: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.pending, () => 'loading')
      .addCase(fetchInitialData.fulfilled, () => 'successful')
      .addCase(fetchInitialData.rejected, () => 'failed');
  },
});

const { actions } = loadingStatusSlice;

const loadingStatusSelectors = {
  getStatus: (state) => state.loadingStatus,
};

export { actions, loadingStatusSelectors };
export default loadingStatusSlice.reducer;
