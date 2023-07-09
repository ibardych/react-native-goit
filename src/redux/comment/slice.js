import { createSlice } from '@reduxjs/toolkit';
import { createComment, getComments } from './operations';

const initialState = {
  comment: {
    id: null,
    postid: null,
    text: '',
    date: null,
  },
  comments: [],
  error: null,
  isLoading: false,
};

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  extraReducers: builder => {
    builder
      .addCase(createComment.fulfilled, (state, { payload }) => {
        state.comment = payload.comment;
      })
      .addCase(createComment.rejected, (state, { payload }) => {
        console.log('payloadError: ', payload);
        state.isLoggedIn = false;
      })
      .addCase(getComments.pending, state => {
        state.isLoading = true;
      })
      .addCase(getComments.fulfilled, (state, { payload }) => {
        state.comments = payload.comments;
        state.isLoading = false;
      })
      .addCase(getComments.rejected, (state, { payload }) => {
        console.log('payloadError: ', payload);
        state.isLoading = false;
      });
  },
});

export const commentReducer = commentSlice.reducer;
