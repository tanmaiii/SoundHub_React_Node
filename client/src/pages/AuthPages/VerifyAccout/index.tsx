import React, { useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./style.scss";
import ButtonLoading from "../../../components/Loading/Button";
import { use } from "i18next";
import { authApi } from "../../../apis";
import { PATH } from "../../../constants/paths";
import { useTranslation } from "react-i18next";

const VerifyAccout = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [token, setToken] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [loadingResend, setLoadingResend] = React.useState(false);
  const [resend, setResend] = React.useState(false);
  const [errorResend, setErrorResend] = React.useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation("auth");

  useEffect(() => {
    const tokenUrl = queryParams.get("token");
    const emailUrl = queryParams.get("email");
    if (tokenUrl) setToken(tokenUrl);
    if (emailUrl) setEmail(emailUrl);
  }, [location]);

  useEffect(() => {
    const verify = async () => {
      setLoading(true);
      try {
        const res =
          email && token && (await authApi.verifyAccount(email, token));
        res && setSuccess(res?.success);
        res && res?.success ? setError(false) : setError(true);
      } catch (error) {
        setError(true);
        console.log(error);
      }
      setLoading(false);
    };
    setTimeout(() => {
      verify();
    }, 3000);
  }, [token, email]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate(PATH.LOGIN);
      }, 3000);
    }
  }, [success]);

  const handleClick = async () => {
    setLoadingResend(true);
    setResend(false);

    const sendEmail = async () => {
      try {
        email && (await authApi.sendVerifyAccount(email));
        setLoadingResend(false);
        setErrorResend(false);
        setResend(true);
      } catch (error) {
        setErrorResend(true);
      }
      setTimeout(() => {
        setErrorResend(false);
        setResend(false);
      }, 5000);
      setLoadingResend(false);
    };

    setTimeout(() => {
      sendEmail();
    }, 3000);
  };

  return (
    <div className="VerifyAccout">
      {loading && (
        <>
          <ButtonLoading size="L" />
          <div className="VerifyAccout__header">
            <i className="fa-regular fa-envelope"></i>
            <h1>{t("VerifyAccount.Title")}</h1>
          </div>
          <span>
            {t("VerifyAccount.Description")}
            <strong>{email}</strong>
          </span>
        </>
      )}

      {error && (
        <>
          <div className="VerifyAccout__error">
            <div>
              <i className="fa-solid fa-circle-exclamation"></i>{" "}
              <h1>{t("VerifyAccount.VerifyFailed")}</h1>
            </div>
            <span>{t("VerifyAccount.DescFailed")}</span>
            {loadingResend ? (
              <ButtonLoading size="S" />
            ) : errorResend ? (
              <span className="error">
                <i className="fa-sharp fa-solid fa-circle-xmark"></i>{" "}
                {t("VerifyAccount.ResendFailed")}
              </span>
            ) : resend ? (
              <span className="success">
                <i className="fa-sharp fa-solid fa-circle-check"></i>{" "}
                {t("VerifyAccount.ResendSuccessfully")}
              </span>
            ) : (
              <button onClick={handleClick}>{t("VerifyAccount.Resend")}</button>
            )}
          </div>
        </>
      )}

      {success && (
        <>
          <div className="check">
            <i className="fa-sharp fa-solid fa-circle-check"></i>
          </div>
          <div className="VerifyAccout__header">
            <h1>{t("VerifyAccount.VerifySuccessfully")}</h1>
          </div>
          <span>{t("VerifyAccount.DescSuccess")}</span>
        </>
      )}
    </div>
  );
};

export default VerifyAccout;
