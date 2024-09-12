import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { log } from "node:console";

export interface menuSongState {
  open: boolean;
  id: string;
  left: number;
  top: number;
  playlistId?: string;
  width?: number;
  height?: number;
}

const initialState: menuSongState = {
  open: false,
  id: "",
  left: 0,
  top: 0,
  width: 0,
  height: 0,
};

export const munuSongSlide = createSlice({
  name: "menuSong",
  initialState,
  reducers: {
    openMenu: (state, action: PayloadAction<menuSongState>) => {
      console.log("open");
      console.log(action.payload.width, action.payload.height);
    
      state.open = true;
      state.id = action.payload.id;
      state.left = action.payload.left;
      state.top = action.payload.top;
      state.playlistId = action.payload.playlistId;
      state.width = action.payload.width;
      state.height = action.payload.height;
    },
    closeMenu: (state) => {
      console.log("close");

      state.open = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { openMenu, closeMenu } = munuSongSlide.actions;

export default munuSongSlide.reducer;
