import React, { useEffect, useRef, useState } from "react";
import avt from "../../assets/images/avatar.jpg";
import apiConfig from '../../api/apiConfig'

import "./userSetting.scss";
import { log } from "console";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { changeDarkMode } from "./UserSettingSlide";
import { logout } from "../Auth/authSlide";

import authApi from "../../api/authApi";

export default function UserSetting() {
  const [active, setActive] = useState(false);
  const dropdownRef = useRef<HTMLInputElement>(null);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const darkMode = useSelector((state: RootState) => state.darkMode.state);
  const dispatch = useDispatch();

  const handleClick = (checked: boolean) => {
    dispatch(changeDarkMode(checked));
  };

  useEffect(() => {
    function handleMousedown(event: MouseEvent) {
      const node = event.target as Node;
      if (!dropdownRef.current?.contains(node)) {
        setActive(false);
      }
    }
    document.addEventListener("mousedown", (event) => handleMousedown(event));
    return () => document.removeEventListener("mousedown", (event) => handleMousedown(event));
  });

  const handleClickLogout = () => {
    dispatch(logout());
    logout();
  };

  return (
    <div ref={dropdownRef} className="UserSetting">
      <div className="UserSetting__avt" onClick={() => setActive(!active)} data-tooltip="Tấn Mãi">
        <img src={currentUser ? apiConfig.imageURL(currentUser.image_path) : avt} alt="" />
      </div>

      <div className={`UserSetting__dropdown ${active ? "active" : ""}`}>
        <div className="UserSetting__dropdown__user">
          <img src={currentUser ? apiConfig.imageURL(currentUser.image_path) : avt} alt="" />
          <div className="UserSetting__dropdown__user__desc">
            <h4>{currentUser.name}</h4>
            <span>Basic</span>
          </div>
        </div>
        <hr />

        <ul className="UserSetting__dropdown__list">
          <li>
            <i className="fa-light fa-circle-user"></i>
            <span>Account</span>
          </li>
          <li>
            <i className="fa-light fa-upload"></i>
            <span>Upload</span>
          </li>
        </ul>
        <hr />

        <ul className="UserSetting__dropdown__list">
          <li>
            <i className="fa-light fa-gear"></i>
            <span>Setting</span>
          </li>

          <li onClick={() => handleClickLogout()}>
            <i className="fa-light fa-right-from-bracket"></i>
            <span>Logout</span>
          </li>
        </ul>

        <hr />

        <div className="UserSetting__dropdown__darkMode">
          <div className="UserSetting__dropdown__darkMode__label">
            <i className="fa-light fa-moon"></i>
            <span>Dark Mode</span>
          </div>
          <button>
            <input
              defaultChecked={darkMode}
              type="checkbox"
              id="switch"
              className="switch-input"
              onClick={() => handleClick(!darkMode)}
            />
            <label htmlFor="switch" className="switch"></label>
          </button>
        </div>
      </div>
    </div>
  );
}
