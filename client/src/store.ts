// import { createStore } from "redux";
// import rootReducer from "./reducers";

// const store = createStore(rootReducer);

// export default store;

//toolkit
import { configureStore } from "@reduxjs/toolkit";
import navbarReducer from "./slices/navbarSlice";
import darkModeReducer from "./slices/darkModeSlice";
import nowPlayingReducer from "./slices/nowPlayingSlice";
import waitingReducer from "./slices/waitingSlice";

const store = configureStore({
  reducer: {
    navbar: navbarReducer,
    darkMode: darkModeReducer,
    nowPlaying: nowPlayingReducer,
    waiting: waitingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
