import React, { useEffect, useState } from "react";
import "./auth.scss";
import { PATH } from "../../constants/paths";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useApi, authApi } from "../../apis";

export default function Signup() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1);
  const { t } = useTranslation("auth");
  const [email, setEmail] = useState("");

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
          <h2>{t("signup.Title")}</h2>
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
                {step === 1 && <h4>{t("signup.Sign up to start listening")}</h4>}
                {step === 2 && <h4>{t("signup.Create a password")}</h4>}
                {step === 3 && <h4>{t("signup.Tell us about yourself")}</h4>}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <SignupEmail handleClickNext={handleClickNext} email={email} setEmail={setEmail} />
        )}

        {step === 2 && <SignupPassword />}

        {step === 3 && <SignupInfo />}
        <div className="auth__container__group">
          <span className="auth__navigation">
            {t("signup.Don't have an account?")}
            <Link to={PATH.LOGIN}>{t("signup.Login for Sound hub")}</Link>
          </span>
        </div>
        {/* <div className="auth__container__group">
          <button className="btn_submit" onClick={handleClickNext}>
            {t("signup.Next")}
          </button>
          <span className="auth__navigation">
            {t("signup.Don't have an account?")}
            <Link to={PATH.LOGIN}>{t("signup.Login for Sound hub")}</Link>
          </span>
        </div> */}
      </div>
    </div>
  );
}

type SignupEmailProps = {
  handleClickNext: () => void; // handleClickNext là một hàm không có tham số và không có giá trị trả về
  email: string; // email là một chuỗi
  setEmail: React.Dispatch<React.SetStateAction<string>>; // setEmail là một hàm để cập nhật giá trị của email
};

export function SignupEmail({ handleClickNext, email, setEmail }: SignupEmailProps) {
  const [err, setErr] = useState("");
  const { t } = useTranslation("auth");

  const handleClick = async () => {
    if (email.trim() !== "") {
      try {
        await useApi.findByEmail(email);
        handleClickNext();
      } catch (err: any) {
        setErr("Địa chỉ này đã được liên kết với một tài khoản hiện có.");
      }
    }
  };

  return (
    <>
      <div className="auth__container__group">
        <h4 className="title">{t("signup.Email")}</h4>
        <div className={`input ${err ? "error" : ""}`}>
          <input
            type="text"
            placeholder="name@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {/* <div className="desc">
          <span>{t("signup.Email account has not been registered yet")}</span>
        </div> */}
        {err && (
          <div className="error">
            <i className="fa-sharp fa-light fa-circle-exclamation"></i>
            <span>{err}</span>
          </div>
        )}
      </div>
      <div className="auth__container__group">
        <button className="btn_submit" onClick={handleClick}>
          {t("signup.Next")}
        </button>
      </div>
    </>
  );
}

export function SignupPassword() {
  const [show, setShow] = useState(false);
  const { t } = useTranslation("auth");

  return (
    <div className="auth__container__group">
      <h4 className="title">{t("signup.Password")}</h4>
      <div className="input">
        <input type={`${show ? "text" : "password"}`} placeholder="Password" />
        <span className="tooglePassword" onClick={() => setShow(!show)}>
          {show ? <i className="fa-light fa-eye"></i> : <i className="fa-light fa-eye-slash"></i>}
        </span>
      </div>
      <div className="desc">
        <h4>{t("signup.PasswordOption.title")}</h4>
        <ul>
          <li>
            <i className="fa-light fa-circle"></i>
            <span>{t("signup.PasswordOption.1 letter")}</span>
          </li>
          <li>
            <i className="fa-light fa-circle"></i>
            <span>{t("signup.PasswordOption.option 2")}</span>
          </li>
          <li>
            <i className="fa-light fa-circle"></i>
            <span>{t("signup.PasswordOption.10 characters")}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export function SignupInfo() {
  const [show, setShow] = useState(false);
  const { t } = useTranslation("auth");

  return (
    <>
      <div className="auth__container__group">
        <h4 className="title">{t("signup.Name")}</h4>
        <div className="input">
          <input type="text" placeholder="Your name" />
        </div>

        {/* <div className="error">
            <i className="fa-sharp fa-light fa-circle-exclamation"></i>
            <span>Please enter your Spotify username or email address</span>
          </div> */}
      </div>

      <div className="auth__container__group">
        <h4 className="title">{t("signup.Date of birth")}</h4>
        <div className="input">
          <input type="date" placeholder="your name" />
        </div>
      </div>

      <div className="auth__container__group">
        <h4 className="title">{t("signup.Gender")}</h4>
        <div className="input__gender">
          <div className="input__gender__item">
            <input type="radio" name="gender" id="gender-man" value={"Man"} />
            <label htmlFor="gender-man">
              <span className="btn"></span>
              <span className="title">{t("signup.GenderOption.Man")}</span>
            </label>
          </div>

          <div className="input__gender__item">
            <input type="radio" name="gender" id="gender-woman" value={"Man"} />
            <label htmlFor="gender-woman">
              <span className="btn"></span>
              <span className="title">{t("signup.GenderOption.Woman")}</span>
            </label>
          </div>

          <div className="input__gender__item">
            <input type="radio" name="gender" id="gender-other" value={"Man"} />
            <label htmlFor="gender-other">
              <span className="btn"></span>
              <span className="title">{t("signup.GenderOption.Other")}</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
