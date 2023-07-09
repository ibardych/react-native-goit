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
  postsLoading: false,
  likeLoading: false,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  extraReducers: builder => {
    builder
      .addCase(createPost.fulfilled, (state, { payload }) => {
        state.post = payload.post;
      })
      .addCase(createPost.rejected, (state, { payload }) => {
        console.log('createPostError: ', payload);
      })
      .addCase(getPosts.pending, state => {
        state.postsLoading = true;
      })
      .addCase(getPosts.fulfilled, (state, { payload }) => {
        state.posts = payload.posts;
        state.postsLoading = false;
      })
      .addCase(getPosts.rejected, (state, { payload }) => {
        console.log('getPostError: ', payload);
        state.postsLoading = false;
      })
      .addCase(getPostsByUser.pending, state => {
        state.postsLoading = true;
      })
      .addCase(getPostsByUser.fulfilled, (state, { payload }) => {
        state.postsbyUser = payload.posts;
        state.postsLoading = false;
      })
      .addCase(getPostsByUser.rejected, (state, { payload }) => {
        console.log('getPostsByUserError: ', payload);
        state.postsLoading = false;
      })
      .addCase(likePost.pending, (state, action) => {
        const postId = action.meta.arg;
        state.likeLoading = postId;
      })
      .addCase(likePost.fulfilled, (state, { payload }) => {
        const { postid, likes, liked, postsByUser } = payload;
        if (postsByUser) {
          const index = state.postsbyUser.findIndex(obj => obj.id === postid);
          state.postsbyUser[index].likes = likes;
          state.postsbyUser[index].liked = liked;
        } else {
          const index = state.posts.findIndex(obj => obj.id === postid);
          state.posts[index].likes = likes;
          state.posts[index].liked = liked;
        }
        state.likeLoading = false;
      })
      .addCase(likePost.rejected, (state, { payload }) => {
        console.log('likePostError: ', payload);
        state.likeLoading = false;
      });
  },
});

export const postReducer = postSlice.reducer;
