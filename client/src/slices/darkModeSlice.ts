import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface navbarState {
  state: boolean;
}

const initialState: navbarState = {
  state: true,
};

const loadDarkModeState = (): boolean => {
  const darkModeState = localStorage.getItem("darkModeState");
  return darkModeState ? JSON.parse(darkModeState) : initialState.state;
};

export const darkModeSlide = createSlice({
  name: "darkMode",
  initialState: {
    state: loadDarkModeState(),
  },
  reducers: {
    changeDarkMode: (state, action: PayloadAction<boolean>) => {
      state.state = action.payload;
      localStorage.setItem("darkModeState", JSON.stringify(action.payload));
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeDarkMode } = darkModeSlide.actions;

export default darkModeSlide.reducer;
