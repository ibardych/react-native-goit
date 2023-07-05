import { createSlice } from '@reduxjs/toolkit';
import { getCurrentUser, logIn, logOut, register } from './operations';

const initialState = {
  user: {
    id: null,
    email: null,
    username: null,
    avatar: null,
  },
  error: null,
  isRefreshing: true,
  isLoggedIn: false,
  authError: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: builder => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        const { uid, email, username, avatar } = action.payload;
        state.user.id = uid;
        state.user.email = email;
        state.user.username = username;
        state.user.avatar = avatar;
        state.isLoggedIn = true;
      })
      .addCase(register.rejected, (state, action) => {
        console.log('payloadError: ', action.payload);
        state.isLoggedIn = false;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        const { uid, email, username, avatar } = action.payload;
        state.user.id = uid;
        state.user.email = email;
        state.user.username = username;
        state.user.avatar = avatar;
        state.isLoggedIn = true;
      })
      .addCase(logIn.rejected, (state, action) => {
        console.log('payloadError: ', action.payload);
        state.isLoggedIn = false;
        // state.authError = action.payload;
      })
      .addCase(logOut.fulfilled, (state, action) => {
        state.user = {};
        // state.isLoggedIn = false;
      })
      .addCase(logOut.rejected, (state, action) => {
        console.log('payloadError: ', action.payload);
        state.isLoggedIn = false;
        // state.authError = action.payload;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        console.log('payload: ', action.payload);
        state.isLoggedIn = true;
        // const { uid, email } = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        console.log('payloadError: ', action.payload);
        state.isLoggedIn = false;
        // state.authError = action.payload;
      });
  },
  reducers: {
    setIsLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
    },
  },
});

export const { setIsLoggedIn } = userSlice.actions;
export const userReducer = userSlice.reducer;
