import type { TConstructorState, TOrder } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: TConstructorState;
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  isOrderModalOpen: boolean;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
