import React, { useEffect, useRef, useState } from "react";

import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { changeDarkMode } from "../../slices/darkModeSlice";

import { useAuth } from "../../context/authContext";
import { PATH } from "../../constants/paths";
import { Link } from "react-router-dom";
import Images from "../../constants/images";
import { apiConfig } from "../../configs";
import ImageWithFallback from "../ImageWithFallback";

export default function UserSetting() {
  const [active, setActive] = useState(false);
  const dropdownRef = useRef<HTMLInputElement>(null);
  const { currentUser, logout } = useAuth();
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
    return () =>
      document.removeEventListener("mousedown", (event) =>
        handleMousedown(event)
      );
  });

  const handleClickLogout = () => {
    logout();
  };

  return (
    currentUser && (
      <div ref={dropdownRef} className="UserSetting">
        <div
          className="UserSetting__avt"
          onClick={() => setActive(!active)}
          data-tooltip="Tấn Mãi"
        >
          <ImageWithFallback
            alt=""
            src={currentUser && apiConfig.imageURL(currentUser.image_path)}
            fallbackSrc={Images.AVATAR}
          />
        </div>

        <div className={`UserSetting__dropdown ${active ? "active" : ""}`}>
          <div className="UserSetting__dropdown__user">
            <Link to={`${PATH.ARTIST + "/" + currentUser?.id}`}>
              <ImageWithFallback
                alt=""
                src={currentUser && apiConfig.imageURL(currentUser.image_path)}
                fallbackSrc={Images.AVATAR}
              />
            </Link>

            <div className="UserSetting__dropdown__user__desc">
              <Link to={`${PATH.ARTIST + "/" + currentUser?.id}`}>
                <h4>{currentUser?.name}</h4>
              </Link>
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
              <Link to={`${PATH.ARTIST}/${currentUser.id}`}>
                <i className="fa-light fa-circle-user"></i>
                <span>Profile</span>
              </Link>
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
    )
  );
}
