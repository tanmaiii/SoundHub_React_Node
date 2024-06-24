import React, { useEffect, useState, useRef } from "react";
import "./auth.scss";
import { PATH } from "../../constants/paths";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { userApi, authApi } from "../../apis";
import Loading from "../Loading/Loading";

type PropsSignupPassword = {
  handleClickNext: () => void;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
};

type PropsSignupEmail = {
  handleClickNext: () => void;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
};

type PropsSignupInfo = {
  handleClickNext: () => void;
  handleSignup: () => void;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  birthDay: string;
  setBirthDay: React.Dispatch<React.SetStateAction<string>>;
  genre: string;
  setGenre: React.Dispatch<React.SetStateAction<string>>;
};

export default function Signup() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1);
  const { t } = useTranslation("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState("");

  const maxStep = 3;

  const progressbar = (step / maxStep) * 100;

  const handleClicCancel = () => {
    step > 1 && setStep(step - 1);
  };

  const handleClickNext = () => {
    step < maxStep && setStep(step + 1);
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      // await authApi.signup(email, password, name, birthDay, genre);
      // await authApi.sendVerificationEmail(email);
      setSuccess(true);
      setLoading(false);
    } catch (error: any) {
      setErr("Something went wrong !");
    }
    setLoading(false);
  };

  return (
    <div className="auth">
      {loading && <Loading />}
      <div className="auth__container">
        <div className="auth__container__title">
          <h2>{t("signup.Title")}</h2>
        </div>

        {success ? (
          <div className="auth__container__success">
            <i className="fa-regular fa-circle-check"></i>
            <h2>Account registration successful</h2>
            <span>Please check your email and confirm</span>
          </div>
        ) : (
          <>
            {step >= 1 && (
              <div className="auth__container__step">
                <div className="progressbar">
                  <div
                    style={{ inlineSize: `${progressbar}%` }}
                    className="progressbar__value"
                  ></div>
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

            <div className="auth__container__group">
              {err && (
                <div className="error">
                  <i className="fa-sharp fa-light fa-circle-exclamation"></i>
                  <span>{err}</span>
                </div>
              )}
            </div>

            {step === 1 && (
              <SignupEmail handleClickNext={handleClickNext} email={email} setEmail={setEmail} />
            )}

            {step === 2 && (
              <SignupPassword
                handleClickNext={handleClickNext}
                password={password}
                setPassword={setPassword}
              />
            )}

            {step === 3 && (
              <SignupInfo
                handleClickNext={handleClickNext}
                handleSignup={handleSignup}
                name={name}
                setName={setName}
                genre={genre}
                setGenre={setGenre}
                birthDay={birthDay}
                setBirthDay={setBirthDay}
              />
            )}

            <div className="auth__container__group">
              <span className="auth__navigation">
                {t("signup.Don't have an account?")}
                <Link to={PATH.LOGIN}>{t("signup.Login for Sound hub")}</Link>
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function SignupEmail({ handleClickNext, email, setEmail }: PropsSignupEmail) {
  const [err, setErr] = useState("");
  const { t } = useTranslation("auth");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = async () => {
    setErr("");
    if (email.trim() !== "") {
      try {
        await userApi.findByEmail(email);
        handleClickNext();
      } catch (err: any) {
        setErr(err.response.data.conflictError);
      }
    } else {
      setErr("Please enter email");
      inputRef.current && inputRef.current.focus();
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
            ref={inputRef}
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

export function SignupPassword({ handleClickNext, password, setPassword }: PropsSignupPassword) {
  const [show, setShow] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation("auth");
  const [hasLetter, setHasLetter] = useState(false);
  const [hasNumberOrSpecialChar, setHasNumberOrSpecialChar] = useState(false);
  const [hasMinimumLength, setHasMinimumLength] = useState(false);

  const handleClick = () => {
    if (hasLetter && hasNumberOrSpecialChar && hasMinimumLength) {
      handleClickNext();
    } else {
      inputRef.current && inputRef.current.focus();
    }
  };

  useEffect(() => {
    setHasLetter(false);
    setHasNumberOrSpecialChar(false);
    setHasMinimumLength(false);

    if (/[A-Za-z]/.test(password)) {
      setHasLetter(true);
    }

    if (/[\d@#$%^&+=!]/.test(password)) {
      setHasNumberOrSpecialChar(true);
    }

    if (password.length >= 10) {
      setHasMinimumLength(true);
    }
    if (password.length >= 50) {
      setHasMinimumLength(false);
    }
  });

  return (
    <>
      <div className="auth__container__group">
        <h4 className="title">{t("signup.Password")}</h4>
        <div className="input">
          <input
            type={`${show ? "text" : "password"}`}
            placeholder="Password"
            ref={inputRef}
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="tooglePassword" onClick={() => setShow(!show)}>
            {show ? <i className="fa-light fa-eye"></i> : <i className="fa-light fa-eye-slash"></i>}
          </span>
        </div>
        <div className="desc">
          <h4>{t("signup.PasswordOption.title")}</h4>
          <ul>
            <li>
              {hasLetter ? (
                <i className="fa-solid fa-circle-check"></i>
              ) : (
                <i className="fa-light fa-circle"></i>
              )}
              <span>{t("signup.PasswordOption.1 letter")}</span>
            </li>
            <li>
              {hasNumberOrSpecialChar ? (
                <i className="fa-solid fa-circle-check"></i>
              ) : (
                <i className="fa-light fa-circle"></i>
              )}
              <span>{t("signup.PasswordOption.option 2")}</span>
            </li>
            <li>
              {hasMinimumLength ? (
                <i className="fa-solid fa-circle-check"></i>
              ) : (
                <i className="fa-light fa-circle"></i>
              )}
              <span>{t("signup.PasswordOption.10 characters")}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="auth__container__group">
        <button className="btn_submit" onClick={handleClick}>
          {t("signup.Next")}
        </button>
      </div>
    </>
  );
}

export function SignupInfo({
  handleClickNext,
  handleSignup,
  name,
  setName,
  birthDay,
  setBirthDay,
  genre,
  setGenre,
}: PropsSignupInfo) {
  const [show, setShow] = useState(false);
  const [errName, setErrName] = useState("");
  const [errBirthday, setErrBirthday] = useState("");
  const [errGender, setErrGender] = useState("");
  const { t } = useTranslation("auth");

  const handleClick = () => {
    setErrName("");
    setErrBirthday("");
    setErrGender("");
    let hasError = false;

    if (name.trim() === "") {
      setErrName("Enter a name for your profile");
      hasError = true;
    } else if (name.length > 20) {
      setErrName("Name must not exceed 20 characters");
      hasError = true;
    }

    if (birthDay.length === 0) {
      setErrBirthday("Please enter your date of birth.");
      hasError = true;
    }

    if (genre === "") {
      setErrGender("Select your gender");
      hasError = true;
    }

    if (!hasError) {
      handleSignup();
    }
  };

  return (
    <>
      <div className="auth__container__group">
        <h4 className="title">{t("signup.Name")}</h4>
        <div className="desc">
          <span>This name will appear on your profile</span>
        </div>
        <div className={`input ${errName ? "error" : ""}`}>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        {errName && (
          <div className="error">
            <i className="fa-sharp fa-light fa-circle-exclamation"></i>
            <span>{errName}</span>
          </div>
        )}
      </div>

      <div className="auth__container__group">
        <h4 className="title">{t("signup.Date of birth")}</h4>
        <div className="desc">
          <span>Why do we need your date of birth?</span>
        </div>
        <div className="input">
          <input
            type="date"
            placeholder="your name"
            value={birthDay}
            onChange={(e) => setBirthDay(e.target.value)}
          />
        </div>
        {errBirthday && (
          <div className="error">
            <i className="fa-sharp fa-light fa-circle-exclamation"></i>
            <span>{errBirthday}</span>
          </div>
        )}
      </div>

      <div className="auth__container__group">
        <h4 className="title">{t("signup.Gender")}</h4>
        <div className="desc">
          <span>
            We use your gender to help personalize our content recommendations and ads for you.
          </span>
        </div>
        <div className="input__gender">
          <div className="input__gender__item">
            <input
              type="radio"
              name="gender"
              id="gender-man"
              value={"man"}
              checked={genre === "man"}
              onChange={(e) => setGenre(e.target.value)}
            />
            <label htmlFor="gender-man">
              <span className="btn"></span>
              <span className="title">{t("signup.GenderOption.Man")}</span>
            </label>
          </div>

          <div className="input__gender__item">
            <input
              type="radio"
              name="gender"
              id="gender-woman"
              value={"woman"}
              checked={genre === "woman"}
              onChange={(e) => setGenre(e.target.value)}
            />
            <label htmlFor="gender-woman">
              <span className="btn"></span>
              <span className="title">{t("signup.GenderOption.Woman")}</span>
            </label>
          </div>

          <div className="input__gender__item">
            <input
              type="radio"
              name="gender"
              id="gender-other"
              value={"other"}
              checked={genre === "other"}
              onChange={(e) => setGenre(e.target.value)}
            />
            <label htmlFor="gender-other">
              <span className="btn"></span>
              <span className="title">{t("signup.GenderOption.Other")}</span>
            </label>
          </div>
        </div>
        {errGender && (
          <div className="error">
            <i className="fa-sharp fa-light fa-circle-exclamation"></i>
            <span>{errGender}</span>
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
