import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface menuPlaylistState {
  open: boolean;
  id: string;
  left: number;
  top: number;
  // playlistId?: string;
  width?: number;
  height?: number;
}

const initialState: menuPlaylistState = {
  open: false,
  id: "",
  left: 0,
  top: 0,
  width: 0,
  height: 0,
};

export const munuSongSlide = createSlice({
  name: "menuPlaylist",
  initialState,
  reducers: {
    openMenu: (state, action: PayloadAction<menuPlaylistState>) => {
      state.open = true;
      state.id = action.payload.id;
      state.left = action.payload.left;
      state.top = action.payload.top;
      // state.playlistId = action.payload.playlistId;
      state.width = action.payload.width;
      state.height = action.payload.height;
    },
    closeMenu: (state) => {
      state.open = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { openMenu, closeMenu } = munuSongSlide.actions;

export default munuSongSlide.reducer;
