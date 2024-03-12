import React, { useEffect, useRef, useState } from "react";
import avt from "../../assets/images/avatar.jpg";

import UserSetting from "../UserSetting/UserSetting";

import "./header.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { changeOpen } from "../../slices/navbar";
import { Link } from "react-router-dom";
import Modal from "../Modal/Modal";
import Login from "../Auth/Login";
import Signup from "../Auth/Signup";
import { PATH } from "../../constants/paths";

export default function Header() {
  const openMenu = useSelector((state: RootState) => state.navbar.openMenu);
  const headerRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [openModalLogin, setOpenModalLogin] = useState(false);
  const [openModalSignup, setOpenModalSignup] = useState(false);

  useEffect(() => {
    const handleScrollHeader = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

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

  return (
    <>
      <div className="header" ref={headerRef}>
        <div className="header__left">
          <button className="header__left__menu" onClick={() => handleClickMenu()}>
            <i className="fa-regular fa-bars"></i>
          </button>
          <button disabled data-tooltip={"Go back"}>
            <i className="fa-solid fa-angle-left"></i>
          </button>
          <button data-tooltip={"Go next"}>
            <i className="fa-solid fa-angle-right"></i>
          </button>
        </div>
        <div className="header__center">
          <div className="header__center__search">
            <i className="fa-thin fa-magnifying-glass"></i>
            <input type="text" placeholder="Search artist, title, ablum,..." />
          </div>
        </div>
        <div className="header__right">
          {currentUser ? (
            <UserSetting />
          ) : (
            <>
              <Link to={PATH.SIGNUP}>
                <div className="header__right__signup">
                  <button className="btn__auth">Sign up</button>
                </div>
              </Link>
              <Link to={PATH.LOGIN}>
                <div className="header__right__login">
                  <button className="btn__auth">Log in</button>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
