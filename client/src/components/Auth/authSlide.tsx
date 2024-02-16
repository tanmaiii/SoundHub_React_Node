import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


export interface IUser {
  id: string;
  name: string;
  email: string;
  accessToken: string;
}

const userType: IUser = {
  id: "",
  name: "",
  email: "",
  accessToken: "",
};

const initialState = {
  user: userType,
  loading: false,
  error: null,
  success: false
};

export const authSlide = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loggin: (state, action) => {},
  },
});

// Action creators are generated for each case reducer function
export const { } = authSlide.actions;

export default authSlide.reducer;
