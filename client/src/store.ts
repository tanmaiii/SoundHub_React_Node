// import { createStore } from "redux";
// import rootReducer from "./reducers";

// const store = createStore(rootReducer);

// export default store;

//toolkit
import { configureStore } from "@reduxjs/toolkit";
import navbarReducer from "./slices/navbar";
import darkModeReducer from "./slices/darkMode";

const store = configureStore({
  reducer: {
    navbar: navbarReducer,
    darkMode: darkModeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
