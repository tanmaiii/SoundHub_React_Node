import React, { useEffect } from "react";
import "./authLayout.scss";
import logo from "../../assets/images/logo_blog.png";

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) return navigate("/");
  });

  return (
    <div className="AuthLayout">
      <div className="AuthLayout__header">
        <Link to={"/"} className="AuthLayout__header__logo">
          <img src={logo} alt="" />
          <h2>Sound Hub</h2>
        </Link>
      </div>
      <div className="AuthLayout__content">{children}</div>
      <footer className="AuthLayout__footer">
        <p>
          This site is protected by reCAPTCHA and the Google
          <a href="https://policies.google.com/privacy" target="_blank">
            Privacy Policy
          </a>
          and
          <a href="https://policies.google.com/terms" target="_blank">
            Terms of Service
          </a>
          apply.
        </p>
      </footer>
    </div>
  );
}
