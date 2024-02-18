// import { createStore } from "redux";
// import rootReducer from "./reducers";

// const store = createStore(rootReducer);

// export default store;

//toolkit
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./pages/ExampleReduxToolkit/counterSlide";
import navbarReducer from "../src/components/Navbar/navbarSlide";
import darkModeReducer from "../src/components/UserSetting/UserSettingSlide";
import authReducer from "../src/components/Auth/authSlide";

const store = configureStore({
  reducer: {
    counter: counterReducer,
    navbar: navbarReducer,
    darkMode: darkModeReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
