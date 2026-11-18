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
  authCheckError: string | null;
  loginError: string | null;
  registerError: string | null;
  updateUserError: string | null;
  logoutError: string | null;
};

const initialState: TUserState = {
  isAuthChecked: false,
  isLoading: false,
  data: null,
  authCheckError: null,
  loginError: null,
  registerError: null,
  updateUserError: null,
  logoutError: null,
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
        state.authCheckError = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.data = null;
        state.isLoading = false;
        state.authCheckError = action.error.message ?? null;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.authCheckError = null;
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.registerError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.registerError =
          action.error.message ?? 'Ошибка при регистрации пользователя';
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.registerError = null;
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.loginError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.loginError = action.error.message ?? 'Ошибка при входе в систему';
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loginError = null;
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.updateUserError = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.updateUserError =
          action.error.message ?? 'Ошибка при обновлении пользователя';
        state.isAuthChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.updateUserError = null;
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.logoutError = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.logoutError = action.error.message ?? 'Ошибка при выходе из системы';
        state.isAuthChecked = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.data = null;
        state.logoutError = null;
        state.isLoading = false;
        state.isAuthChecked = true;
      });
  },
  reducers: {
    clearLoginError: (state) => {
      state.loginError = null;
    },
    clearRegisterError: (state) => {
      state.registerError = null;
    },
    clearUpdateUserError: (state) => {
      state.updateUserError = null;
    },
  },
});

export const { clearLoginError, clearRegisterError, clearUpdateUserError } =
  userSlice.actions;
export const userReducer = userSlice.reducer;
