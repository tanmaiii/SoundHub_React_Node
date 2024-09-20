import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./style.scss";
import { PATH } from "../../../constants/paths";
import { useTranslation } from "react-i18next";
import { authApi } from "../../../apis";
import { Value } from "sass";
import Button from "../../../components/Loading/Button";

type TInput = {
  value: string;
  error: string;
  view: boolean;
};

const ResetPassword = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [token, setToken] = React.useState("");
  const { t } = useTranslation("auth");
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,30}$/;

  const [password, setPassword] = React.useState<TInput>({
    value: "",
    error: "",
    view: false,
  });
  const [rePassword, setRePassword] = React.useState<TInput>({
    value: "",
    error: "",
    view: false,
  });

  const updatePassword = (newValue: Partial<TInput>) => {
    setPassword((prevState) => ({ ...prevState, ...newValue }));
  };

  const updateRePassword = (newValue: Partial<TInput>) => {
    setRePassword((prevState) => ({ ...prevState, ...newValue }));
  };

  useEffect(() => {
    const tokenUrl = queryParams.get("token");
    if (tokenUrl) setToken(tokenUrl);
  }, [location]);

  const handleClick = async () => {
    if (rePassword.error && password.error) return;
    setLoading(true);
    setSuccess(false);
    try {
      await authApi.resetPassword(token, password?.value);
      setLoading(false);
      setSuccess(true);
    } catch (error) {
      setError("Có lỗi xảy ra, vui lòng thử lại sau");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (password.value && password.value.length < 6) {
      updatePassword({ error: t("ResetPassword.ErrorPasswordLength") });
    } else if (password.value && !passwordRegex.test(password.value)) {
      updatePassword({
        error: t("ResetPassword.ErrorPassword"),
      });
    } else {
      updatePassword({ error: "" });
    }

    if (rePassword.value && password.value !== rePassword.value) {
      updateRePassword({ error: t("ResetPassword.ErrorPasswordMatch") });
    } else {
      updateRePassword({ error: "" });
    }
  }, [password.value, rePassword.value]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate(PATH.LOGIN);
      }, 3000);
    }
  }, [success]);

  return (
    <div className="ResetPassword">
      {!success ? (
        <div className="ResetPassword__container">
          <div className="ResetPassword__container__title">
            <h2>{t("ResetPassword.Title")}</h2>
            <span>{t("ResetPassword.Description")}</span>
          </div>
          {error && (
            <div className="error">
              <i className="fa-sharp fa-light fa-circle-exclamation"></i>
              <span>{error}</span>
            </div>
          )}
          <div className="ResetPassword__container__group">
            <h4 className="title">{t("ResetPassword.NewPassword")}</h4>
            <div className={`input ${password.error ? "error" : ""}`}>
              <input
                autoComplete="off"
                type={`${password.view ? "text" : "password"}`}
                name="password"
                placeholder="Mật khẩu mới"
                onChange={(e) =>
                  updatePassword({ value: e.target.value.trim() })
                }
              />
              <span
                className="tooglePassword"
                onClick={() => updatePassword({ view: !password.view })}
              >
                {!password.view ? (
                  <i className="fa-light fa-eye"></i>
                ) : (
                  <i className="fa-light fa-eye-slash"></i>
                )}
              </span>
            </div>
            {password.error && (
              <div className="error">
                <i className="fa-sharp fa-light fa-circle-exclamation"></i>
                <span>{password.error}</span>
              </div>
            )}
          </div>
          <div className="ResetPassword__container__group">
            <h4 className="title">{t("ResetPassword.ReNewPassword")}</h4>
            <div className={`input ${rePassword.error ? "error" : ""}`}>
              <input
                autoComplete="off"
                type={`${rePassword.view ? "text" : "password"}`}
                name="password"
                placeholder="Nhập lại mật khẩu mới"
                onChange={(e) =>
                  updateRePassword({ value: e.target.value.trim() })
                }
              />
              <span
                className="tooglePassword"
                onClick={() => updateRePassword({ view: !rePassword.view })}
              >
                {!rePassword.view ? (
                  <i className="fa-light fa-eye"></i>
                ) : (
                  <i className="fa-light fa-eye-slash"></i>
                )}
              </span>
            </div>
            {rePassword.error && (
              <div className="error">
                <i className="fa-sharp fa-light fa-circle-exclamation"></i>
                <span>{rePassword.error}</span>
              </div>
            )}
          </div>
          <div className="ResetPassword__container__group">
            {!loading ? (
              <button className="btn_submit" onClick={() => handleClick()}>
                {t("ResetPassword.Submit")}
              </button>
            ) : (
              <div className="btn_loading">
                <Button size="M" />
              </div>
            )}
            <span className="auth__navigation">
              {t("login.Don't have an account?")}
              <Link to={PATH.SIGNUP}>{t("login.Sign up for Sound hub")}</Link>
            </span>
          </div>
        </div>
      ) : (
        <div className="ResetPassword__container">
          <div className="ResetPassword__container__title">
            <i className="fa-sharp fa-solid fa-circle-check"></i>{" "}
            <h2>{t("ResetPassword.Success")}</h2>
            <span>{t("ResetPassword.SuccessDescription")}</span>
          </div>
          <div className="ResetPassword__container__group">
            <span className="auth__navigation">
              <Link to={PATH.SIGNUP}> {t("ResetPassword.Login")}</Link>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
