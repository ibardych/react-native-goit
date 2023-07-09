import { createSlice } from '@reduxjs/toolkit';
import { getCurrentUser, logIn, logOut, register } from './operations';

const initialState = {
  user: {
    id: null,
    email: null,
    username: null,
    avatar: null,
  },
  isLoggedIn: false,
  authError: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: builder => {
    builder
      .addCase(register.fulfilled, (state, { payload }) => {
        const { uid, email, username, avatar } = payload;
        state.user.id = uid;
        state.user.email = email;
        state.user.username = username;
        state.user.avatar = avatar;
        state.isLoggedIn = true;
      })
      .addCase(register.rejected, (state, { payload }) => {
        console.log('registerError: ', payload);
        state.isLoggedIn = false;
      })
      .addCase(logIn.fulfilled, (state, { payload }) => {
        const { uid, email, username, avatar } = payload;
        state.user.id = uid;
        state.user.email = email;
        state.user.username = username;
        state.user.avatar = avatar;
        state.isLoggedIn = true;
      })
      .addCase(logIn.rejected, (state, { payload }) => {
        console.log('logInError: ', payload);
        state.isLoggedIn = false;
        state.authError = payload;
      })
      .addCase(logOut.fulfilled, (state, { payload }) => {
        state.user = {};
        state.isLoggedIn = false;
      })
      .addCase(logOut.rejected, (state, { payload }) => {
        console.log('logOutErrror: ', payload);
        state.isLoggedIn = false;
        state.authError = payload;
      })
      .addCase(getCurrentUser.fulfilled, (state, { payload }) => {
        console.log('payload: ', payload);
        state.isLoggedIn = true;
        // const { uid, email } = payload;
      })
      .addCase(getCurrentUser.rejected, (state, { payload }) => {
        console.log('getCurrentUserError: ', payload);
        state.isLoggedIn = false;
        state.authError = payload;
      });
  },
  reducers: {
    setIsLoggedIn(state, { payload }) {
      state.isLoggedIn = payload;
    },
    unsetAuthError(state, { payload }) {
      state.authError = '';
    },
  },
});

export const { setIsLoggedIn, unsetAuthError } = userSlice.actions;
export const userReducer = userSlice.reducer;
