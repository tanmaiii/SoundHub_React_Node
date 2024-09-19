import React, { useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./style.scss";
import ButtonLoading from "../../../components/Loading/Button";
import { use } from "i18next";
import { authApi } from "../../../apis";
import { PATH } from "../../../constants/paths";

const VerifyAccout = () => {
  const params = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [token, setToken] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

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
        console.log(res);
        res && setSuccess(res?.success);
      } catch (error) {
        setError("Xác thực tài khoản thất bại");
        console.log(error);
      }
      setLoading(false);
    };
    verify();
  }, [token, email]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate(PATH.LOGIN);
      }, 3000);
    }
  }, [success]);

  const handleClick = async () => {
    try {
      email && (await authApi.sendVerifyAccount(email));
    } catch (error) {}
  };

  return (
    <div className="VerifyAccout">
      {loading && (
        <>
          <ButtonLoading />
          <div className="VerifyAccout__header">
            <i className="fa-regular fa-envelope"></i>
            <h1>Xác thực tài khoản</h1>
          </div>
          <span>
            Đang thực hiện xác thực tài khoản người dùng với email là{" "}
            <strong>{email}</strong>
          </span>
        </>
      )}

      {error && (
        <>
          <div className="VerifyAccout__error">
            <div>
              <i className="fa-solid fa-circle-exclamation"></i>{" "}
              <h1>{error}</h1>
            </div>
            <span>Vui lòng kiểm tra lại email</span>
            <button onClick={handleClick}>Gửi lại email</button>
          </div>
        </>
      )}

      {success && (
        <>
          <div className="check">
            <i className="fa-sharp fa-solid fa-circle-check"></i>
          </div>
          <div className="VerifyAccout__header">
            <h1>Xác thực thành công</h1>
          </div>
          <span>
            Tài khoản của bạn đã được xác thực thành công. Bạn sẽ được chuyển
            hướng về trang đăng nhập sau 3s
          </span>
        </>
      )}
    </div>
  );
};

export default VerifyAccout;
