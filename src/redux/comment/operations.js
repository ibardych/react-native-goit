import { createAsyncThunk } from '@reduxjs/toolkit';
import { auth, db } from '../../../firebase';
import {
  Timestamp,
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
  doc,
  getDoc,
} from 'firebase/firestore';
import { formatDate } from '../../utils/common';

export const createComment = createAsyncThunk(
  'comment/create',
  async ({ postid, comment: text }, thunkAPI) => {
    try {
      const { uid } = auth.currentUser;

      console.log(postid);

      const timestamp = Timestamp.now();

      const collectionRef = collection(db, 'comments');
      const docRef = await addDoc(collectionRef, {
        postid,
        text,
        uid,
        timestamp,
      });

      const { id } = docRef;
      console.log('Comment created with ID: ', id);

      const date = formatDate(timestamp);

      return {
        comment: { postid, text, date, id },
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const getComments = createAsyncThunk(
  'comment/get',
  async (postid, thunkAPI) => {
    try {
      const user = auth.currentUser;

      const collectionRef = collection(db, 'comments');
      const q = query(
        collectionRef,
        orderBy('timestamp'),
        where('postid', '==', postid)
      );

      const querySnapshot = await getDocs(q);
      const comments = [];

      for (const comment of querySnapshot.docs) {
        const { postid, uid, text, timestamp } = comment.data();

        const date = formatDate(timestamp);

        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        const author = docSnap.data();

        comments.push({
          id: comment.id,
          postid,
          uid,
          text,
          date,
          owner: user.uid === uid ? true : false,
          avatar: author.photoURL,
          username: author.username,
        });
      }

      return { comments };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
