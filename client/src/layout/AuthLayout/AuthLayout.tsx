import React, { useEffect } from "react";
import "./authLayout.scss";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { PATH } from "../../constants/paths";
import Images from "../../constants/images";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  document.title = "Sound - Đăng nhập";
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) return navigate(PATH.HOME);
  });

  return (
    <div className="AuthLayout">
      <div className="AuthLayout__left">
        <div className="AuthLayout__left__header">
          <Link to={PATH.HOME} className="AuthLayout__left__header__logo">
            <img className="image__logo" src={Images.LOGO} alt="" />
            <h2>Sound</h2>
          </Link>
        </div>
        <img className="image__main" src={Images.BG} alt="" />
      </div>
      <div className="AuthLayout__body">{children}</div>
    </div>
  );
}
