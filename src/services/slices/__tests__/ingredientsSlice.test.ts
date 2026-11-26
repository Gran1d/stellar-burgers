import { expect, test, describe } from '@jest/globals';

import { ingredientsReducer, getIngredients, initialState } from '../ingredientsSlice';

import type { TIngredient } from '@/utils/types';

const ingredients: TIngredient[] = [
  {
    _id: 'test-bun',
    name: 'Тестовая булка',
    type: 'bun',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 10,
    price: 100,
    image: '',
    image_large: '',
    image_mobile: '',
  },
];

describe('Редьюсер ingredients', () => {
  test('Возвращение начального состояния для несуществующего экшена', () => {
    const result = ingredientsReducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual({ data: [], isLoading: false, ingredientsError: null });
  });

  test('pending, сброс ошибки ingredientsError и установка статуса загрузки isLoading = true ', () => {
    const previousState = {
      ...initialState,
      data: [],
      ingredientsError: 'Прошлая ошибка',
    };

    const action = getIngredients.pending('test_id');
    const result = ingredientsReducer(previousState, action);

    expect(result.ingredientsError).toBeNull();
    expect(result.isLoading).toBe(true);
  });

  test('fulfilled сохранение полученных ингредиентов и завершение загрузки isLoading = false', () => {
    const previousState = {
      ...initialState,
      isLoading: true,
    };

    const action = getIngredients.fulfilled(ingredients, 'test_id');
    const result = ingredientsReducer(previousState, action);

    expect(result.data).toEqual(ingredients);
    expect(result.isLoading).toBe(false);
  });

  test('rejected сохранение сообщения об ошибке и завершение загрузки isLoading = false', () => {
    const previousState = {
      ...initialState,
      isLoading: true,
      data: ingredients,
    };

    const action = getIngredients.rejected(new Error('Тестовая ошибка'), 'test_id');
    const result = ingredientsReducer(previousState, action);

    expect(result.isLoading).toBe(false);
    expect(result.ingredientsError).toBe('Тестовая ошибка');
  });
});
