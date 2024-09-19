import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./verifyPage.scss";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import queryString from "query-string";
import { PATH } from "../../../constants/paths";
import { authApi } from "../../../apis";
import Loading from "../../../components/Loading";

export default function VerifyPage() {
  const { t } = useTranslation("auth");
  const location = useLocation();
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [sendSuccess, setSendSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Lấy tham số token từ URL và phân tích nó thành một đối tượng
  const { token } = queryString.parse(location.search) as { token: string };
  const { email } = queryString.parse(location.search) as { email: string };

  useEffect(() => {
    const VerifyEmail = async () => {
      try {
        // await authApi.verifyEmail(token);
        setSuccess("Successfully authenticated account");
      } catch (err: any) {
        console.log(err);
        
        setErr("The authentication code has expired !");
      }
    };
    !err && VerifyEmail();
  }, []);

  const handleSubmitVerify = async () => {
    setLoading(true);
    setSendSuccess("");
    try {
      // await authApi.sendVerificationEmail(email);
      setLoading(false);
      setSendSuccess("Send verification email success !");
    } catch (err: any) {
      setErr(err.response.data.conflictError);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!token) return navigate(PATH.HOME);
  });

  return (
    <div className="verifyPage">
      <div className="verifyPage__container">
        <div className="verifyPage__container__title">
          <h2>Verify Email</h2>
        </div>
        <div className="verifyPage__container__body">
          {success && (
            <div className="success">
              <i className="fa-solid fa-circle-check"></i>
              <h2>Successfully authenticated account</h2>
              <Link to={PATH.LOGIN}>{t("login.Login")}</Link>
            </div>
          )}
          {err && (
            <div className="error">
              <i className="fa-solid fa-circle-exclamation"></i>
              <h2>{err}</h2>
              {loading ? (
                <div className="btn-loading"></div>
              ) : sendSuccess ? (
                <div className="sendSuccess">
                  <i className="fa-regular fa-circle-check"></i>
                  <span>{sendSuccess}</span>
                </div>
              ) : (
                <button onClick={() => handleSubmitVerify()}>Submit authentication again</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
