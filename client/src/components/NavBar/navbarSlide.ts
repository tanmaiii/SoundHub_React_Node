import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";
import { act } from "react-dom/test-utils";

export interface navbarState {
  path: string;
  closeMenu: boolean;
}

const initialState: navbarState = {
  path: "/",
  closeMenu: false,
};

export const navbarSlide = createSlice({
  name: "counter",
  initialState,
  reducers: {
    changePath: (state, action) => {
      state.path = action.payload;
    },
    changeOpen: (state, action) => {
      state.closeMenu = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changePath,changeOpen } = navbarSlide.actions;

export default navbarSlide.reducer;
