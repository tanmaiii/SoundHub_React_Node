import React, { useEffect, useRef, useState } from "react";

import UserSetting from "../UserSetting";

import "./header.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { changeOpen } from "../../slices/navbarSlice";
import { Link } from "react-router-dom";
import { PATH } from "../../constants/paths";
import { useAuth } from "../../context/authContext";
import { useTranslation } from "react-i18next";

export default function Header() {
  const openMenu = useSelector((state: RootState) => state.navbar.openMenu);
  const headerRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const { t } = useTranslation("home");

  useEffect(() => {
    const handleScrollHeader = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop == 0) {
        headerRef.current?.classList.remove("shrink");
      } else {
        headerRef.current?.classList.add("shrink");
      }
    };

    window.addEventListener("scroll", handleScrollHeader);

    return () => window.removeEventListener("scroll", handleScrollHeader);
  });

  const handleClickMenu = () => {
    dispatch(changeOpen(!openMenu));
  };

  const handleClickGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    }
  };

  const handleClickGoNext = () => {
    if (window.history.length - 1 > 1) {
      window.history.forward();
    }
  };

  useEffect(() => {
    console.log(window.history);
  });

  return (
    <>
      <div className="header" ref={headerRef}>
        <div className="header__left">
          <button
            className="header__left__menu"
            onClick={() => handleClickMenu()}
          >
            <i className="fa-regular fa-bars"></i>
          </button>
          <button
            disabled={window.history.length === 0}
            data-tooltip={"Go back"}
            onClick={() => handleClickGoBack()}
          >
            <i className="fa-solid fa-angle-left"></i>
          </button>
          <button
            disabled={window.history.length - 1 <= 1}
            data-tooltip={"Go next"}
            onClick={() => handleClickGoNext()}
          >
            <i className="fa-solid fa-angle-right"></i>
          </button>
        </div>
        <div className="header__center">
          <div className="header__center__search">
            <i className="fa-thin fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder={t("header.Search artist, title, ablum,...")}
            />
          </div>
        </div>
        <div className="header__right">
          {currentUser ? (
            <UserSetting />
          ) : (
            <>
              <Link to={PATH.SIGNUP}>
                <div className="header__right__signup">
                  <button className="btn__auth">{t("header.signup")}</button>
                </div>
              </Link>
              <Link to={PATH.LOGIN}>
                <div className="header__right__login">
                  <button className="btn__auth">{t("header.login")}</button>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
