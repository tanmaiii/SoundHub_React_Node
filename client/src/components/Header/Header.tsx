import React, { useEffect, useRef } from "react";
import avt from "../../assets/images/avatar.jpg";

import UserSetting from "../UserSetting/UserSetting";

import "./header.scss";

export default function Header() {
  const headerRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="header" ref={headerRef}>
      <div className="header__left">
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
        <div className="header__right__darkMode"></div>

        <UserSetting />
        {/* <div className="header__right__avt">
          <img src={avt} alt="" />
        </div> */}
      </div>
    </div>
  );
}
