import React, { useState } from "react";
import "./auth.scss";

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { PATH } from "../../constants/paths";
import { useAuth } from "../../context/AuthContext";
import authApi from "../../apis/auth/authApi";

export default function Login() {
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const { t } = useTranslation("auth");

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async () => {
    try {
      // return login(inputs.email, inputs.password);
      const res = await authApi.signin(inputs.email, inputs.password);
      res && login(res.data, res.token);
    } catch (err: any) {
      setErr(err?.response.data.conflictError);
    }
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <div className="auth__container__title">
          <h2>{t("login.Title")}</h2>
        </div>

        {err && (
          <div className="error">
            <i className="fa-sharp fa-light fa-circle-exclamation"></i>
            <span>{err}</span>
          </div>
        )}

        <div className="auth__container__group">
          <h4 className="title">{t("login.Email")}</h4>
          <div className="input ">
            <input
              value={inputs.email}
              autoComplete="off"
              type="text"
              name="email"
              placeholder="Email"
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
        <div className="auth__container__group">
          <h4 className="title">{t("login.Password")}</h4>
          <div className="input">
            <input
              value={inputs.password}
              autoComplete="off"
              type={`${show ? "text" : "password"}`}
              name="password"
              placeholder="Password"
              onChange={(e) => handleChange(e)}
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
          <p className="forgot">{t("login.Forgot your password ?")}</p>
          <button className="btn_submit" onClick={() => handleClick()}>
            {t("login.Login")}
          </button>
          <span className="auth__navigation">
            {t("login.Don't have an account?")}
            <Link to={PATH.SIGNUP}>{t("login.Sign up for Sound hub")}</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
