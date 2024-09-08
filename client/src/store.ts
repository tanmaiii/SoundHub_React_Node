//toolkit
import { configureStore } from "@reduxjs/toolkit";
import navbarReducer from "./slices/navbarSlice";
import darkModeReducer from "./slices/darkModeSlice";
import waitingReducer from "./slices/waitingSlice";
import lyricReducer from "./slices/lyricSlice";

const store = configureStore({
  reducer: {
    navbar: navbarReducer,
    darkMode: darkModeReducer,
    waiting: waitingReducer,
    lyric: lyricReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
