import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  type TLoginData,
  type TRegisterData,
} from '@/utils/burger-api';
import { deleteCookie, setCookie } from '@/utils/cookie';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TUser } from '@utils-types';

type TUserState = {
  data: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  userError: string | null;
};

const initialState: TUserState = {
  isAuthChecked: false,
  isLoading: false,
  data: null,
  userError: null,
};

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response.user;
  }
);

export const loginUser = createAsyncThunk('user/loginUser', async (data: TLoginData) => {
  const response = await loginUserApi(data);
  setCookie('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);

  return response.user;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: Partial<TRegisterData>) => {
    const response = await updateUserApi(user);
    return response.user;
  }
);

export const logout = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.userError = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.data = null;
        state.isLoading = false;
        state.userError = action.error.message ?? null;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.userError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.userError = action.error.message ?? 'Ошибка при регистрации пользователя';
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.userError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.userError = action.error.message ?? 'Ошибка при входе в систему';
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.userError = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.userError = action.error.message ?? 'Ошибка при обновлении пользователя';
        state.isAuthChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.userError = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.userError = action.error.message ?? 'Ошибка при выходе из системы';
        state.isAuthChecked = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.data = null;
        state.isLoading = false;
        state.isAuthChecked = true;
      });
  },
  reducers: {},
});

export const userReducer = userSlice.reducer;
