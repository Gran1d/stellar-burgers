import { clearUpdateUserError, updateUser } from '@/services/slices/userSlice';
import { useSelector, useDispatch } from '@/services/store';
import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

export const Profile = (): React.JSX.Element => {
  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
  const error = useSelector((state) => state.user.updateUserError);

  const [formValue, setFormValue] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
  });

  useEffect(() => {
    dispatch(clearUpdateUserError());
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name ?? '',
      email: user?.email ?? '',
    }));
  }, [user, dispatch]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();

    const data = {
      name: formValue.name,
      email: formValue.email,
      ...(formValue.password ? { password: formValue.password } : {}),
    };

    try {
      await dispatch(updateUser(data)).unwrap();

      setFormValue((prev) => ({
        ...prev,
        password: '',
      }));
    } catch {
      // Ошибка сохраняется в userSlice и отображается через updateUserError.
    }
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={error ?? ''}
      handleCancel={handleCancel}
      handleSubmit={(e): void => {
        void handleSubmit(e);
      }}
      handleInputChange={handleInputChange}
    />
  );
};
