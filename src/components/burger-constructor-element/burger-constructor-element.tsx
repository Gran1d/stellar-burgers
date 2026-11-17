import { moveIngredient, removeIngredient } from '@/services/slices/constructorSlice';
import { useDispatch } from '@/services/store';
import { BurgerConstructorElementUI } from '@ui';
import { memo } from 'react';

import type { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement = memo(function BurgerConstructorElement({
  ingredient,
  index,
  totalItems,
}: BurgerConstructorElementProps): React.JSX.Element {
  const dispatch = useDispatch();

  const handleMoveDown = (): void => {
    // TODO
    dispatch(moveIngredient({ dragIndex: index, hoverIndex: index + 1 }));
  };

  const handleMoveUp = (): void => {
    // TODO
    dispatch(moveIngredient({ dragIndex: index, hoverIndex: index - 1 }));
  };

  const handleClose = (): void => {
    // TODO
    dispatch(removeIngredient(ingredient.id));
  };

  return (
    <BurgerConstructorElementUI
      ingredient={ingredient}
      index={index}
      totalItems={totalItems}
      handleMoveUp={handleMoveUp}
      handleMoveDown={handleMoveDown}
      handleClose={handleClose}
    />
  );
});
