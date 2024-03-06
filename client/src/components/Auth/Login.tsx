import React, { MouseEvent, useState } from "react";
import "./auth.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { loginSuccess, loginFailure } from "../../slices/auth";

import userApi from "../../api/userApi";
import authApi from "../../api/authApi";

export default function Login() {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = () => {
    try {
      const getList = async () => {
        const res = await authApi.signin(inputs.email, inputs.password);
        console.log(res);
        
        if (res) dispatch(loginSuccess(res));
      };
      getList();
    } catch (err: any) {
      setErr(err.response.data);
      // console.log(err.response.data);
    }
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <div className="auth__container__title">
          <h2>Log in on Sound</h2>
        </div>

        {err && (
          <div className="error">
            <i className="fa-sharp fa-light fa-circle-exclamation"></i>
            <span>{err}</span>
          </div>
        )}
        <div className="auth__container__group">
          <h4 className="title">Email</h4>
          <div className="input">
            <input
              autoComplete="off"
              type="text"
              name="email"
              placeholder="Email"
              onChange={(e) => handleChange(e)}
              defaultValue={"tanmai3@gmail.com"}
            />
          </div>
        </div>
        <div className="auth__container__group">
          <h4 className="title">Password</h4>
          <div className="input">
            <input
              autoComplete="off"
              type={`${show ? "text" : "password"}`}
              name="password"
              placeholder="Password"
              onChange={(e) => handleChange(e)}
              defaultValue={"123456"}
            />
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
