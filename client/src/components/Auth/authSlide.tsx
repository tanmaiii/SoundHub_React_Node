import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// export interface IUser {
//   id: string;
//   name: string;
//   email: string;
// }

// const userInfo: IUser = {
//   id: "",
//   name: "",
//   email: "",
// };

const initialState = {
  user: undefined,
  isLoggedIn: false,
  error: null,
};

export const authSlide = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    loginFailure: (state, action) => {
      state.isLoggedIn = false;
      state.user = undefined;
      state.error = action.payload;
      localStorage.removeItem("userInfo");
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = undefined;
      state.error = null;
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
