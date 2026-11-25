import { getIngredientsApi } from '@/utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TIngredient } from '@utils-types';

type TIngredientsState = {
  data: TIngredient[];
  isLoading: boolean;
  ingredientsError: string | null;
};

const initialState: TIngredientsState = {
  isLoading: false,
  data: [],
  ingredientsError: null,
};

export const getIngredients = createAsyncThunk(
  'ingredients/getIngredients',
  async () => {
    const response = await getIngredientsApi();
    return response;
  }
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.ingredientsError = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.ingredientsError = action.error.message ?? 'Ошибка получения ингредиентов';
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      });
  },
  reducers: {},
});

export const ingredientsReducer = ingredientsSlice.reducer;
