import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { log } from "node:console";

export interface menuSongState {
  open: boolean;
  id: string;
  left: number;
  top: number;
  playListId?: string;
}

const initialState: menuSongState = {
  open: false,
  id: "",
  left: 0,
  top: 0,
};

export const munuSongSlide = createSlice({
  name: "menuSong",
  initialState,
  reducers: {
    openMenu: (state, action: PayloadAction<menuSongState>) => {
      console.log(action.payload);

      state.open = action.payload.open;
      state.id = action.payload.id;
      state.left = action.payload.left;
      state.top = action.payload.top;
      state.playListId = action.payload.playListId;
    },
    closeMenu: (state) => {
      state.open = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { openMenu, closeMenu } = munuSongSlide.actions;

export default munuSongSlide.reducer;
