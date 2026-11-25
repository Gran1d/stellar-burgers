import { getIngredients } from '@/services/slices/ingredientsSlice';
import { fetchUser } from '@/services/slices/userSlice';
import { useDispatch, useSelector } from '@/services/store';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
} from '@pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';

import { ProtectedRoute } from '../routes/protected-route';

import type { AppContentProps } from './type';
import type { Location } from 'react-router-dom';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const ingredients = useSelector((state) => state.ingredients.data);
  const isIngredientsLoading = useSelector((state) => state.ingredients.isLoading);
  const ingredientsError = useSelector((state) => state.ingredients.ingredientsError);

  useEffect(() => {
    void dispatch(getIngredients());
    void dispatch(fetchUser());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError ? { message: ingredientsError } : null}
      />
    </div>
  );
};

export default App;

/* Маршруты показываются только когда ингредиенты загружены: без них не
   отрисовать ни конструктор, ни состав заказа. */
const AppContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return <RouteComponent />;
};

const OrderInfoModal = ({ onClose }: { onClose: () => void }): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();

  return (
    <Modal title={`#${number?.padStart(6, '0') ?? ''}`} onClose={onClose}>
      <OrderInfo />
    </Modal>
  );
};

const OrderInfoPage = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();

  return (
    <div className={styles.detailPageWrap}>
      <p className={`${styles.detailHeader} text text_type_digits-default`}>
        #{number?.padStart(6, '0')}
      </p>
      <OrderInfo />
    </div>
  );
};

type ModalLocationState = {
  background?: Location;
};

const RouteComponent = (): React.JSX.Element => {
  const navigation = useNavigate();
  const location = useLocation();
  const locationState = location.state as ModalLocationState | null;
  const backgroundLocation = locationState?.background;

  const handleCloseModal = (): void => {
    void navigation(-1);
  };

  return (
    <>
      <Routes location={backgroundLocation ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route
          path="/login"
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound404 />} />
        <Route path="/feed/:number" element={<OrderInfoPage />} />
        <Route
          path="/ingredients/:id"
          element={
            <div className={styles.detailPageWrap}>
              <h1 className={`${styles.detailHeader} text text_type_main-large`}>
                Детали ингредиента
              </h1>
              <IngredientDetails />
            </div>
          }
        />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <OrderInfoPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route
            path="/feed/:number"
            element={<OrderInfoModal onClose={handleCloseModal} />}
          />
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <OrderInfoModal onClose={handleCloseModal} />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};
