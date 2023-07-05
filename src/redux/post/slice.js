import { createSlice } from '@reduxjs/toolkit';
import { createPost, getPosts, getPostsByUser, likePost } from './operations';

const initialState = {
  post: {
    image: null,
    title: '',
    location: '',
    coords: {},
  },
  posts: [],
  postsbyUser: [],
  error: null,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  extraReducers: builder => {
    builder
      .addCase(createPost.fulfilled, (state, action) => {
        state.post = action.payload.post;
      })
      .addCase(createPost.rejected, (state, action) => {
        console.log('payloadError: ', action.payload);
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.posts = action.payload.posts;
      })
      .addCase(getPosts.rejected, (state, action) => {
        console.log('payloadError: ', action.payload);
      })
      .addCase(getPostsByUser.fulfilled, (state, action) => {
        state.postsbyUser = action.payload.posts;
      })
      .addCase(getPostsByUser.rejected, (state, action) => {
        console.log('payloadError: ', action.payload);
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const { postid, likes, liked } = action.payload;
        const index = state.posts.findIndex(obj => obj.id === postid);
        state.posts[index].likes = likes;
        state.posts[index].liked = liked;
      })
      .addCase(likePost.rejected, (state, action) => {
        console.log('payloadError: ', action.payload);
        // state.isLoggedIn = false;
      });
  },
});

export const postReducer = postSlice.reducer;
