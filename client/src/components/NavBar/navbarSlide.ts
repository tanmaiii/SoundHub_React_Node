import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface navbarState {
  value: string;
}

const initialState: navbarState = {
  value: "/",
};

export const navbarSlide = createSlice({
  name: "counter",
  initialState,
  reducers: {
    changePath: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changePath } = navbarSlide.actions;

export default navbarSlide.reducer;
