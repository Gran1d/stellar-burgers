import { getFeeds } from '@/services/slices/feedSlice';
import { useDispatch, useSelector } from '@/services/store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import type { TOrder } from '@utils-types';

export const Feed = (): React.JSX.Element => {
  // TODO: Взять переменную из стора
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector((state) => state.feed.orders);

  useEffect(() => {
    void dispatch(getFeeds());
  }, [dispatch]);

  const handleGetFeeds = (): void => {
    // TODO: Запросить ленту заказов
    void dispatch(getFeeds());
  };

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
