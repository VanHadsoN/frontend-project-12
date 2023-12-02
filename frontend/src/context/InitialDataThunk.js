import { createAsyncThunk } from '@reduxjs/toolkit';
import ChatContextProvider from './ChatContext';

const fetchInitialData = createAsyncThunk(
  'fetchInitialData',
  async (_, { rejectWithValue }) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const { data } = await ChatContextProvider.getServerData(user.token);
      return data;
    } catch (error) {
      if (error.isAxiosError) {
        return rejectWithValue(error.response.status);
      }
      throw error;
    }
  },
);

export default fetchInitialData;
