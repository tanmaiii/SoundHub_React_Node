import React, { useState } from "react";
import "./auth.scss";
import { PATH } from "../../constants/paths";
import { Link } from "react-router-dom";

export default function Signup() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1);

  const maxStep = 3;

  const progressbar = (step / maxStep) * 100;

  const handleClicCancel = () => {
    step > 1 && setStep(step - 1);
  };

  const handleClickNext = () => {
    step < maxStep && setStep(step + 1);
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <div className="auth__container__title">
          <h2>Sign up on Sound</h2>
        </div>

        {step >= 1 && (
          <div className="auth__container__step">
            <div className="progressbar">
              <div style={{ inlineSize: `${progressbar}%` }} className="progressbar__value"></div>
            </div>
            <div className="auth__container__step__main">
              {step > 1 && (
                <div className="button" onClick={handleClicCancel}>
                  <i className="fa-light fa-chevron-left"></i>
                </div>
              )}
              <div className="title">
                <span>Step {step} of 3</span>
                {step === 1 && <h4>Sign up to start listening</h4>}
                {step === 2 && <h4>Create a password</h4>}
                {step === 3 && <h4>Tell us about yourself</h4>}
              </div>
            </div>
          </div>
        )}

        {step === 1 && <SignupEmail />}

        {step === 2 && <SignupPassword />}

        {step === 3 && <SignupInfo />}

        <div className="auth__container__group">
          {/* <a className="forgot">Forgot your password ?</a> */}
          <button className="btn_submit" onClick={handleClickNext}>
            Next
          </button>
          <span className="auth__navigation">
            Don't have an account?
            <Link to={PATH.LOGIN}>Login for Spotify</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export function SignupEmail() {
  return (
    <div className="auth__container__group">
      <h4 className="title">Email address</h4>
      <div className="input">
        <input type="text" placeholder="name@domain.com" />
      </div>
      <div className="desc">
        <span>Email account has not been registered yet</span>
      </div>
      {/* <div className="error">
    <i className="fa-sharp fa-light fa-circle-exclamation"></i>
    <span>Please enter your Spotify username or email address</span>
  </div> */}
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
          <input type="text" placeholder="Your name" />
        </div>

        {/* <div className="error">
            <i className="fa-sharp fa-light fa-circle-exclamation"></i>
            <span>Please enter your Spotify username or email address</span>
          </div> */}
      </div>

      <div className="auth__container__group">
        <h4 className="title">Date of birth</h4>
        <div className="input">
          <input type="date" placeholder="your name" />
        </div>
      </div>

      <div className="auth__container__group">
        <h4 className="title">Gender</h4>
        <div className="input__gender">
          <div className="input__gender__item">
            <input type="radio" name="gender" id="gender-man" value={"Man"} />
            <label htmlFor="gender-man">
              <span className="btn"></span>
              <span className="title">Man</span>
            </label>
          </div>

          <div className="input__gender__item">
            <input type="radio" name="gender" id="gender-woman" value={"Man"} />
            <label htmlFor="gender-woman">
              <span className="btn"></span>
              <span className="title">Woman</span>
            </label>
          </div>

          <div className="input__gender__item">
            <input type="radio" name="gender" id="gender-other" value={"Man"} />
            <label htmlFor="gender-other">
              <span className="btn"></span>
              <span className="title">Other</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
