import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {User} from '../model/user'

// const userString = localStorage.getItem("user");
// const user: User | null = userString ? JSON.parse(userString) : null;

const initialState = {
  user: undefined,
  isLoggedIn: false,
};

const loadAuthState = () => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const user = JSON.parse(userInfo);
    return {
      ...initialState,
      user,
      isLoggedIn: true,
    };
  } else {
    return initialState;
  }
};

export const authSlide = createSlice({
  name: "auth",
  initialState: loadAuthState(),
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    loginFailure: (state, action) => {
      state.isLoggedIn = false;
      state.user = undefined;
      localStorage.removeItem("userInfo");
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = undefined;
      localStorage.removeItem("userInfo");
    },
    checkLocalStorage: (state) => {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        state.isLoggedIn = true;
        state.user = JSON.parse(userInfo);
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { loginSuccess, loginFailure, logout, checkLocalStorage } = authSlide.actions;

export default authSlide.reducer;
