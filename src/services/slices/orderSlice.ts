import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@/utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { logout } from './userSlice';

import type { TOrder } from '@utils-types';

type TOrderState = {
  userOrders: TOrder[];
  orderByNumber: TOrder | null;
  orderModalData: TOrder | null;
  orderRequest: boolean;
  isLoadingOrderByNumber: boolean;
  isLoadingOrders: boolean;
  isOrderModalOpen: boolean;
  orderError: string | null;
};

const initialState: TOrderState = {
  userOrders: [],
  orderByNumber: null,
  orderModalData: null,
  orderRequest: false,
  isLoadingOrderByNumber: false,
  isLoadingOrders: false,
  isOrderModalOpen: false,
  orderError: null,
};

export const orderBurger = createAsyncThunk(
  'order/orderBurger',
  async (data: string[]) => {
    const response = await orderBurgerApi(data);
    return response;
  }
);

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response;
  }
);

export const getOrders = createAsyncThunk('order/getOrders', async () => {
  const response = await getOrdersApi();
  return response;
});

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
        state.isOrderModalOpen = true;
        state.orderModalData = null;
        state.orderError = null;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        state.isOrderModalOpen = false;
        state.orderError = action.error.message ?? 'Ошибка оформления заказа';
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderModalData = action.payload.order;
        state.orderRequest = false;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoadingOrderByNumber = true;
        state.orderError = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoadingOrderByNumber = false;
        state.orderError = action.error.message ?? 'Ошибка получения заказа по номеру';
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderByNumber = action.payload.orders[0];
        state.isLoadingOrderByNumber = false;
      })
      .addCase(getOrders.pending, (state) => {
        state.isLoadingOrders = true;
        state.orderError = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoadingOrders = false;
        state.orderError = action.error.message ?? 'Ошибка получения заказов';
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
        state.isLoadingOrders = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.userOrders = [];
      });
  },
  reducers: {
    clearOrder: (state) => {
      state.orderModalData = null;
      state.isOrderModalOpen = false;
    },
    clearOrderByNumber: (state) => {
      state.orderByNumber = null;
      state.isLoadingOrderByNumber = false;
    },
  },
});

export const { clearOrder, clearOrderByNumber } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
