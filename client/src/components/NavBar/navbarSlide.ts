import { createSlice } from "@reduxjs/toolkit";


export interface navbarState {
  path: string;
  openMenu: boolean;
}

const initialState: navbarState = {
  path: "/",
  openMenu: false,
};

export const navbarSlide = createSlice({
  name: "counter",
  initialState,
  reducers: {
    changePath: (state, action) => {
      state.path = action.payload;
    },
    changeOpen: (state, action) => {
      state.openMenu = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changePath,changeOpen } = navbarSlide.actions;

export default navbarSlide.reducer;
