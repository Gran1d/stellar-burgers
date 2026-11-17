import { clearConstructor } from '@/services/slices/constructorSlice';
import { clearOrder, orderBurger } from '@/services/slices/orderSlice';
import { useDispatch, useSelector } from '@/services/store';
import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { TConstructorIngredient, TConstructorState, TOrder } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  /** TODO: Взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user.data);
  const constructorItems: TConstructorState = useSelector(
    (state) => state.burgerConstructor
  );
  const orderRequest = useSelector(
    (state: { order: { orderRequest: boolean } }) => state.order.orderRequest
  );
  const orderModalData: TOrder | null = useSelector(
    (state: { order: { orderModalData: TOrder | null } }) => state.order.orderModalData
  );

  const onOrderClick = (): void => {
    if (!user) {
      void navigate('/login', {
        state: { from: location },
      });
      return;
    }

    if (!constructorItems.bun || orderRequest) return;
    // TODO: Оформить заказ
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id,
    ];

    void dispatch(orderBurger(ingredientIds));
  };

  const closeOrderModal = (): void => {
    // TODO: Закрыть модальное окно и сбросить заказ
    dispatch(clearOrder());
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
