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
};

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  extraReducers: builder => {
    builder
      .addCase(createComment.fulfilled, (state, action) => {
        state.comment = action.payload.comment;
      })
      .addCase(createComment.rejected, (state, action) => {
        console.log('payloadError: ', action.payload);
        state.isLoggedIn = false;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.comments = action.payload.comments;
      })
      .addCase(getComments.rejected, (state, action) => {
        console.log('payloadError: ', action.payload);
        state.isLoggedIn = false;
      });
  },
});

export const commentReducer = commentSlice.reducer;
