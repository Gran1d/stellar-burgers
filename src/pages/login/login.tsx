import { clearLoginError, loginUser } from '@/services/slices/userSlice';
import { useDispatch, useSelector } from '@/services/store';
import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const error = useSelector((state) => state.user.loginError);

  useEffect(() => {
    dispatch(clearLoginError());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
