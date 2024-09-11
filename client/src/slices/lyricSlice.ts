import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface lyricState {
  state: boolean;
}

const initialState: lyricState = {
  state: false,
};


export const lyricModeSlide = createSlice({
  name: "lyric",
  initialState,
  reducers: {
    changeOpenLyric: (state, action: PayloadAction<boolean>) => {
      state.state = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeOpenLyric } = lyricModeSlide.actions;

export default lyricModeSlide.reducer;
