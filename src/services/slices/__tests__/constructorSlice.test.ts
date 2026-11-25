import { expect, test, describe } from '@jest/globals';

import {
  constructorReducer,
  addIngredients,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} from '../constructorSlice';
import { orderBurger } from '../orderSlice';

import type {
  TIngredient,
  TConstructorIngredient,
  TConstructorState,
} from '@/utils/types';

const ingredient: TIngredient = {
  _id: 'ingrident',
  name: 'Тестовый ингридиент',
  type: 'main',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 10,
  price: 100,
  image: '',
  image_large: '',
  image_mobile: '',
};

const bun: TIngredient = {
  ...ingredient,
  _id: 'bun-1',
  name: 'Тестовая булка',
  type: 'bun',
};

const firstIngredient: TConstructorIngredient = {
  ...ingredient,
  id: 'first',
};

const secondIngredient: TConstructorIngredient = {
  ...ingredient,
  id: 'second',
};

const constructorBun: TConstructorIngredient = {
  ...bun,
  id: 'bun',
};

const emptyState: TConstructorState = {
  bun: null,
  ingredients: [],
};

const filledState: TConstructorState = {
  bun: constructorBun,
  ingredients: [firstIngredient, secondIngredient],
};

describe('Редьюсер constructor', () => {
  test('Возвращение начального состояния для несуществующего экшена', () => {
    const result = constructorReducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual({ bun: null, ingredients: [] });
  });

  test('Добавление ингридиента', () => {
    const previousState = {
      bun: constructorBun,
      ingredients: [firstIngredient],
    };

    const action = addIngredients(ingredient);
    const result = constructorReducer(previousState, action);

    expect(result.ingredients).toEqual([firstIngredient, action.payload]);
    expect(result.bun).toEqual(constructorBun);

    expect(action.payload.id).toEqual(expect.any(String));
    expect(action.payload.id).not.toBe('');
  });

  test('Добавление булки', () => {
    const previousState = {
      bun: null,
      ingredients: [firstIngredient],
    };

    const action = addIngredients(bun);
    const result = constructorReducer(previousState, action);

    expect(result.bun).toEqual(action.payload);
    expect(result.ingredients).toEqual([firstIngredient]);
  });

  test('Замена булки', () => {
    const newBun = {
      ...bun,
      _id: 'bun-2',
      name: 'Другая булка',
    };

    const action = addIngredients(newBun);
    const result = constructorReducer(filledState, action);

    expect(result.bun).toEqual(action.payload);
    expect(result.ingredients).toEqual(filledState.ingredients);
  });

  test('Удаление ингридиента по id', () => {
    const action = removeIngredient(firstIngredient.id);
    const result = constructorReducer(filledState, action);

    expect(result.ingredients).toEqual([secondIngredient]);
    expect(result.bun).toEqual(filledState.bun);
  });

  test('Изменение порядка ингридиентов', () => {
    const action = moveIngredient({ dragIndex: 0, hoverIndex: 1 });
    const result = constructorReducer(filledState, action);

    expect(result.ingredients).toEqual([secondIngredient, firstIngredient]);
    expect(result.bun).toEqual(filledState.bun);
  });

  test('Очистка ингридиентов и булок', () => {
    const result = constructorReducer(filledState, clearConstructor());

    expect(result).toEqual(emptyState);
  });

  test('Очистка конструктора после успешного создания заказа', () => {
    const response = {
      success: true,
      name: 'Тестовый бургер',
      order: {
        _id: 'order-1',
        status: 'done',
        name: 'Тестовый бургер',
        createdAt: '2026-01-01T12:00:00.000Z',
        updatedAt: '2026-01-01T12:00:00.000Z',
        number: 12345,
        ingredients: [bun._id, ingredient._id, ingredient._id, bun._id],
      },
    };

    const action = orderBurger.fulfilled(
      response,
      'test_id',
      response.order.ingredients
    );
    const result = constructorReducer(filledState, action);

    expect(result).toEqual(emptyState);
  });
});
