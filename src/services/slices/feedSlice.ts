import { getFeedsApi } from '@/utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrder } from '@utils-types';

type TFeedSliceState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  feedError: string | null;
};

const initialState: TFeedSliceState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  feedError: null,
};

export const getFeeds = createAsyncThunk('feed/getFeeds', async () => {
  const response = await getFeedsApi();
  return response;
});

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.feedError = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.feedError = action.error.message ?? 'Ошибка получения ленты';
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.isLoading = false;
      });
  },
  reducers: {},
});

export const feedReducer = feedSlice.reducer;
