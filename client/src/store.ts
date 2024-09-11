//toolkit
import { configureStore } from "@reduxjs/toolkit";
import navbarReducer from "./slices/navbarSlice";
import darkModeReducer from "./slices/darkModeSlice";
import waitingReducer from "./slices/waitingSlice";
import lyricReducer from "./slices/lyricSlice";
import menuSongReducer from "./slices/menuSongSlide";

const store = configureStore({
  reducer: {
    navbar: navbarReducer,
    darkMode: darkModeReducer,
    waiting: waitingReducer,
    lyric: lyricReducer,
    menuSong: menuSongReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
