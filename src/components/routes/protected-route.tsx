import { useSelector } from '@/services/store';
import { Navigate, useLocation } from 'react-router';

import { Preloader } from '../ui';

import type { Location } from 'react-router-dom';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

type AuthLocationState = {
  from?: Location;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children,
}: ProtectedRouteProps): React.JSX.Element => {
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);
  const user = useSelector((state) => state.user.data);
  const location = useLocation();
  const locationState = location.state as AuthLocationState | null;

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to="/login" state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const from = locationState?.from ?? { pathname: '/' };

    return <Navigate replace to={from} />;
  }

  return children;
};
