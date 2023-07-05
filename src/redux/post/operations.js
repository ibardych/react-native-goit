import { createAsyncThunk } from '@reduxjs/toolkit';
import { auth, db } from '../../../firebase';
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import uploadImage from '../../utils/uploadImage';
import { formatDate } from '../../utils/common';
import countEntries from '../../utils/countEntries';

export const createPost = createAsyncThunk(
  'post/create',
  async (credentials, thunkAPI) => {
    try {
      const { image, title, location, coords } = credentials;
      const { uid } = auth.currentUser;

      let imageURL;
      if (image) imageURL = await uploadImage(image);

      const timestamp = Timestamp.now();

      const collectionRef = collection(db, 'posts');
      const docRef = await addDoc(collectionRef, {
        imageURL,
        title,
        location,
        coords,
        uid,
        timestamp,
      });

      const { id } = docRef;
      console.log('Post created with ID: ', id);

      const date = formatDate(timestamp);

      return {
        post: { ...credentials, imageURL, date, id },
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getPosts = createAsyncThunk('post/getall', async (_, thunkAPI) => {
  try {
    const user = auth.currentUser;
    const collectionRef = collection(db, 'posts');
    const q = query(collectionRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);

    const posts = [];

    for (const post of querySnapshot.docs) {
      const { imageURL, title, location, coords, timestamp, uid, likes } =
        post.data();
      let commentsNumber = 0;

      commentsNumber = await countEntries({
        collection: 'comments',
        by: 'postid',
        query: post.id,
      });

      const date = formatDate(timestamp);

      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      let photoURL;
      if (docSnap.exists()) photoURL = docSnap.data().photoURL;

      posts.push({
        id: post.id,
        imageURL,
        title,
        location,
        coords,
        date,
        uid,
        commentsNumber,
        likes,
        liked: likes ? likes.indexOf(user.uid) !== -1 : false,
        avatar: photoURL,
      });
    }

    return { posts };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const getPostsByUser = createAsyncThunk(
  'post/getallbyuser',
  async (_, thunkAPI) => {
    try {
      const user = auth.currentUser;
      const collectionRef = collection(db, 'posts');
      const q = query(
        collectionRef,
        orderBy('timestamp', 'desc'),
        where('uid', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);

      const posts = [];

      for (const post of querySnapshot.docs) {
        const { imageURL, title, location, coords, timestamp, uid, likes } =
          post.data();
        let commentsNumber = 0;

        commentsNumber = await countEntries({
          collection: 'comments',
          by: 'postid',
          query: doc.id,
        });

        const date = formatDate(timestamp);

        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        let photoURL;
        if (docSnap.exists()) photoURL = docSnap.data().photoURL;

        posts.push({
          id: post.id,
          imageURL,
          title,
          location,
          coords,
          date,
          uid,
          commentsNumber,
          likes,
          liked: likes ? likes.indexOf(user.uid) !== -1 : false,
          avatar: photoURL,
        });
      }

      return { posts };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const likePost = createAsyncThunk(
  'post/like',
  async (postid, thunkAPI) => {
    const { uid } = auth.currentUser;

    try {
      const collectionRef = collection(db, 'posts');
      const docRef = doc(collectionRef, postid);
      const docSnapshot = await getDoc(docRef);
      let newLikes = [];
      let liked = false;

      if (docSnapshot.exists()) {
        const likes = docSnapshot.data()['likes'] || [];
        liked = likes.indexOf(uid) !== -1;

        newLikes = likes.filter(item => item !== uid);
        if (!liked) {
          // set like
          newLikes.push(uid);
          liked = true;
        } else {
          // unset like
          liked = false;
        }

        await updateDoc(docRef, { likes: newLikes });
      } else {
        console.log('Post does not exist.');
      }

      return { postid, likes: newLikes, liked };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
