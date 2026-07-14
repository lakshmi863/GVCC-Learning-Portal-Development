import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getVideos } from '../services/videoService';

export const fetchVideos = createAsyncThunk('videos/fetchAll', async () => {
  return await getVideos();
});

const videoSlice = createSlice({
  name: 'videos',
  initialState: { list: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => { state.loading = true; })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      });
  },
});

export default videoSlice.reducer;