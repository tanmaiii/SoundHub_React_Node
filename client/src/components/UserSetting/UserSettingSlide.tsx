import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit'

export interface navbarState {
  state: boolean;
}

const initialState: navbarState = {
  state: false,
};

export const darkModeSlide = createSlice({
  name: "darkMode",
  initialState,
  reducers: {
    changeDarkMode: (state, action: PayloadAction<boolean>) => {
      state.state = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeDarkMode } = darkModeSlide.actions;

export default darkModeSlide.reducer;
