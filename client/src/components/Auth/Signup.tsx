import React, { useState } from "react";
import "./auth.scss";

export default function Signup() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1);

  return (
    <div className="auth">
      <div className="auth__container">
        <div className="auth__container__title">
          <h2>Sign up on Sound</h2>
        </div>
        {step === 1 && (
          <div className="auth__container__group">
            <h4 className="title">Email address</h4>
            <div className="input">
              <input type="text" placeholder="name@domain.com" />
            </div>
            {/* <div className="error">
            <i className="fa-sharp fa-light fa-circle-exclamation"></i>
            <span>Please enter your Spotify username or email address</span>
          </div> */}
          </div>
        )}

        {step === 2 && <SignupPassword />}

        {step === 3 && <SignupInfo />}
        
        <div className="auth__container__group">
          {/* <a className="forgot">Forgot your password ?</a> */}
          <button className="btn_submit" onClick={() => setStep(step + 1)}>
            Next
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

export function SignupPassword() {
  const [show, setShow] = useState(false);

  return (
    <div className="auth__container__group">
      <h4 className="title">Password</h4>
      <div className="input">
        <input type={`${show ? "text" : "password"}`} placeholder="Password" />
        <span className="tooglePassword" onClick={() => setShow(!show)}>
          {show ? <i className="fa-light fa-eye"></i> : <i className="fa-light fa-eye-slash"></i>}
        </span>
      </div>
      <div className="desc">
        <h4>Your password must contain at least</h4>
        <ul>
          <li>
            <i className="fa-light fa-circle"></i>
            <span>1 letter</span>
          </li>
          <li>
            <i className="fa-light fa-circle"></i>
            <span>1 number or special character (example: # ? ! &)</span>
          </li>
          <li>
            <i className="fa-light fa-circle"></i>
            <span>10 characters</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export function SignupInfo() {
  const [show, setShow] = useState(false);

  return (
    <>
      <div className="auth__container__group">
        <h4 className="title">Name</h4>
        <div className="input">
          <input type="text" placeholder="name@domain.com" />
        </div>
        {/* <div className="error">
            <i className="fa-sharp fa-light fa-circle-exclamation"></i>
            <span>Please enter your Spotify username or email address</span>
          </div> */}
      </div>

      <div className="auth__container__group">
            <h4 className="title">Email address</h4>
            <div className="input">
              <input type="text" placeholder="name@domain.com" />
            </div>
          </div>
    </>
  );
}
