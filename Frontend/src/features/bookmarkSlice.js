import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getBookmarks, saveBookmark } from '../services/bookmarkService';

export const fetchBookmarks = createAsyncThunk('bookmarks/fetch', async (videoId) => {
  return await getBookmarks(videoId);
});

export const addBookmark = createAsyncThunk('bookmarks/add', async (data) => {
  return await saveBookmark(data);
});

const bookmarkSlice = createSlice({
  name: 'bookmarks',
  initialState: { items: [], loading: false },
  reducers: {
    clearBookmarks: (state) => { state.items = []; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addBookmark.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export const { clearBookmarks } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;