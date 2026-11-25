import { getOrders } from '@/services/slices/orderSlice';
import { useDispatch, useSelector } from '@/services/store';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import type { TOrder } from '@utils-types';

export const ProfileOrders = (): React.JSX.Element => {
  const orders: TOrder[] = useSelector((state) => state.order.userOrders);
  const dispatch = useDispatch();

  useEffect(() => {
    void dispatch(getOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
