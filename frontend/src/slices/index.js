import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './channelsSlice';
import messagesReducer from './messagesSlice';
import loadingStatusReducer from './loadingStatusSlice';
import modalReducer from './modalSlice';

export default configureStore({
  reducer: {
    channels: channelsReducer,
    messages: messagesReducer,
    loadingStatus: loadingStatusReducer,
    modal: modalReducer,
  },
});
