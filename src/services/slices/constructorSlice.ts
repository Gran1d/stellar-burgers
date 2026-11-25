import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

import { orderBurger } from './orderSlice';

import type {
  TConstructorIngredient,
  TConstructorState,
  TIngredient,
} from '@utils-types';

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(orderBurger.fulfilled, (state) => {
      state.bun = null;
      state.ingredients = [];
    });
  },
  reducers: {
    addIngredients: {
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      },
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const item = action.payload;
        if (item.type === 'bun') {
          state.bun = item;
        } else {
          state.ingredients.push(item);
        }
      },
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      const idToRemove = action.payload;
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== idToRemove
      );
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      const draggedItem = state.ingredients[dragIndex];
      state.ingredients.splice(dragIndex, 1);
      state.ingredients.splice(hoverIndex, 0, draggedItem);
    },
  },
});

export const { addIngredients, removeIngredient, clearConstructor, moveIngredient } =
  constructorSlice.actions;
export const constructorReducer = constructorSlice.reducer;
