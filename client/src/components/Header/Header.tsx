import React from "react";
import avt from "../../assets/images/avatar.jpg";

import "./header.scss";

export default function Header() {
  return (
    <div className="header">
      <div className="header__left">
        <div className="header__left__search">
          <i className="fa-thin fa-magnifying-glass"></i>
          <input type="text" placeholder="Search artist, title, ablum,..." />
        </div>
      </div>
      <div className="header__right">
        <div className="header__right__avt">
          <img src={avt} alt="" />
        </div>
      </div>
    </div>
  );
}
