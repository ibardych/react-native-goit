import { createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from '../../../firebase';
import uploadImage from '../../utils/uploadImage';
import { collection, doc, setDoc } from 'firebase/firestore';

// export default  instance = axios.create({
//   baseURL: process.env.REACT_APP_BACKAND_BASEURL,
// });

// const setAuthHeader = token => {
//   instance.defaults.headers.common.authorization = `Bearer ${token}`;
// };

// const clearAuthHeader = () => {
//   instance.defaults.headers.common.authorization = null;
// };

export const register = createAsyncThunk(
  'user/register',
  async (credentials, thunkAPI) => {
    try {
      const { email, password, username, image } = credentials;

      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const { uid } = result.user;

      let photoURL = '';
      if (image) photoURL = await uploadImage(image);

      await updateProfile(auth.currentUser, {
        displayName: username,
        photoURL,
      });

      const usersCollectionRef = collection(db, 'users');
      const userDocRef = doc(usersCollectionRef, uid);
      await setDoc(userDocRef, { photoURL, username, email });

      return { uid, email, username, avatar: photoURL };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logIn = createAsyncThunk(
  'user/login',
  async (credentials, thunkAPI) => {
    try {
      const { email, password } = credentials;

      const result = await signInWithEmailAndPassword(auth, email, password);

      const { uid, displayName, photoURL } = result.user;

      return { uid, email, username: displayName, avatar: photoURL };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logOut = createAsyncThunk('user/logout', async (_, thunkAPI) => {
  try {
    await signOut(auth);

    return {};
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const getCurrentUser = createAsyncThunk(
  'user/current',
  async (_, thunkAPI) => {
    try {
      const user = await new Promise((resolve, reject) => {
        auth.onAuthStateChanged(user => {
          if (user) {
            resolve(user);
          } else {
            reject(new Error('User not found'));
          }
        });
      });

      const { uid, email } = user;

      return { uid, email };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
