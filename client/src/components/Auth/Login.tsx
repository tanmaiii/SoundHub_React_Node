import React, { useState } from "react";
import "./auth.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { loginSuccess, loginFailure } from "./authSlide";

import userApi from "../../api/userApi";
import authApi from "../../api/authApi";

export default function Login() {
  const [show, setShow] = useState(false);
  const auth = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleClick = () => {
    try {
      const getList = async () => {
        const res = await authApi.signin("tanmai3@gmail.com", "123457");
        // console.log(res);
        if ("conflictError" in res) {
          dispatch(loginFailure(res.conflictError));
        } else {
          dispatch(loginSuccess(res));
        }
      };
      getList();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <div className="auth__container__title">
          <h2>Log in on Sound</h2>
        </div>
        <div className="auth__container__group">
          <h4 className="title">Email or username</h4>
          <div className="input">
            <input type="text" placeholder="Email or username" />
          </div>

          {/* <div className="error">
            <i className="fa-sharp fa-light fa-circle-exclamation"></i>
            <span>Please enter your Spotify username or email address</span>
          </div> */}
        </div>
        <div className="auth__container__group">
          <h4 className="title">Password</h4>
          <div className="input">
            <input type={`${show ? "text" : "password"}`} placeholder="Password" />
            <span className="tooglePassword" onClick={() => setShow(!show)}>
              {show ? (
                <i className="fa-light fa-eye"></i>
              ) : (
                <i className="fa-light fa-eye-slash"></i>
              )}
            </span>
          </div>
        </div>
        <div className="auth__container__group">
          <a className="forgot">Forgot your password ?</a>
          <button className="btn_submit" onClick={() => handleClick()}>
            Log in
          </button>
          <span className="auth__navigation">
            Don't have an account?
            <a href="">Sign up for Spotify</a>
          </span>
        </div>
      </div>
    </div>
  );
}
