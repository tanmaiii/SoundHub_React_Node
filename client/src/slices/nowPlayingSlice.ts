// nowPlayingSlice.js
import { createSlice } from "@reduxjs/toolkit";

type TNowPlaying = {
  songPlayId: string | null;
  isPlaying: boolean;
};

const initialState: TNowPlaying = {
  songPlayId: null,
  isPlaying: false,
};

export const nowPlayingSlice = createSlice({
  name: "nowPlaying",
  initialState,
  reducers: {
    setNowPlaying: (state: any, action) => {
      state.songPlayId = action.payload.id; // Cập nhật bài hát đang phát
      state.isPlaying = true; // Đặt trạng thái phát là true
    },
    playSong: (state) => {
      state.isPlaying = true; // Đặt trạng thái phát là true (phát nhạc)
    },
    stopSong: (state) => {
      state.isPlaying = false; // Đặt trạng thái phát là false (dừng phát)
    },
  },
});

export const { setNowPlaying, playSong, stopSong } = nowPlayingSlice.actions;

export const selectSongPlayId = (state: any) => state.nowPlaying.songPlayId;
export const selectIsPlaying = (state: any) => state.nowPlaying.isPlaying;

export default nowPlayingSlice.reducer;
