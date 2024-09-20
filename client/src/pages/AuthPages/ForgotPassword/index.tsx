import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./style.scss";
import { Link } from "react-router-dom";
import { PATH } from "../../../constants/paths";
import ButtonLoading from "../../../components/Loading/Button";
import { authApi } from "../../../apis";

type TInput = {
  value: string;
  error: string;
  loading: boolean;
  success?: boolean;
};

const ForgotPassword = () => {
  const { t } = useTranslation("auth");

  const [inputs, setInputs] = useState<TInput>({
    value: "",
    error: "",
    loading: false,
    success: false,
  });

  const updateState = (newValue: Partial<TInput>) => {
    setInputs((prevState) => ({ ...prevState, ...newValue }));
  };

  const handleClick = async () => {
    updateState({ loading: true });
    try {
      const res = await authApi.fogrotPassword(inputs.value);
      updateState({ loading: false, success: true });
      console.log(res);
    } catch (error) {
      updateState({ loading: false, error: "Email not found", success: false });
    }
  };

  return (
    <div className="ForgotPassword">
      <div className="ForgotPassword__container">
        {!inputs.success ? (
          <>
            <>
              <div className="ForgotPassword__container__title">
                <h2>{t("ForgotPassword.Title")}</h2>
                <span>{t("ForgotPassword.Description")}</span>
              </div>
              {inputs?.error && (
                <div className="error">
                  <i className="fa-sharp fa-light fa-circle-exclamation"></i>
                  <span>{inputs?.error}</span>
                </div>
              )}
              <div className="ForgotPassword__container__group">
                <h4 className="title">{t("login.Email")}</h4>
                <div className="input ">
                  <input
                    autoComplete="off"
                    type="text"
                    name="email"
                    placeholder="Email"
                    onChange={(e) => updateState({ value: e.target.value })}
                  />
                </div>
              </div>
              <div className="ForgotPassword__container__group">
                {!inputs.loading ? (
                  <button className="btn_submit" onClick={() => handleClick()}>
                    {t("ForgotPassword.Search")}
                  </button>
                ) : (
                  <div className="btn_loading">
                    <ButtonLoading size="M" />
                  </div>
                )}
              </div>
            </>
          </>
        ) : (
          <div className="success">
            <h2>
              <i className="fa-sharp fa-solid fa-circle-check"></i> Gửi liên kết
              xác thực thành công
            </h2>
            <span>
              Chúng tôi đã gửi liên kết đến email của bạn. Vui lòng kiểm tra và
              thay đổi mật khẩu
            </span>
          </div>
        )}
        <div className="ForgotPassword__container__group">
          <span className="auth__navigation">
            <Link to={PATH.LOGIN}>{t("ForgotPassword.GoBack")}</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
