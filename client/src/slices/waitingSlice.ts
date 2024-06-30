import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface waitingState {
  state: boolean;
}

const initialState: waitingState = {
  state: false,
};


export const darkModeSlide = createSlice({
  name: "waiting",
  initialState,
  reducers: {
    changeOpenWaiting: (state, action: PayloadAction<boolean>) => {
      state.state = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeOpenWaiting } = darkModeSlide.actions;

export default darkModeSlide.reducer;
