import React, { useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { changeDarkMode } from "../../slices/darkModeSlice";
import { RootState } from "../../store";
import "./style.scss";

import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Images from "../../constants/images";
import { PATH } from "../../constants/paths";
import { useAuth } from "../../context/authContext";
import { locales } from "../../i18n/i18n";
import ImageWithFallback from "../ImageWithFallback";

export default function UserSetting() {
  const [active, setActive] = useState(false);
  const [activeMenu, setActiveMenu] = useState("main");
  const dropdownRef = useRef<HTMLInputElement>(null);
  const [height, setHeight] = useState<number>(100);
  const { currentUser, logout } = useAuth();
  const darkMode = useSelector((state: RootState) => state.darkMode.state);
  const dispatch = useDispatch();
  const { t } = useTranslation("header");
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

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

  useEffect(() => {
    active && setActiveMenu("main");
  }, [active]);

  const handleClickLogout = () => {
    logout();
  };

  useEffect(() => {
    if (active) return setActive(false);
  }, [location.pathname]);

  return (
    currentUser && (
      <div ref={dropdownRef} className="UserSetting">
        <div
          className="UserSetting__avt"
          onClick={() => setActive(!active)}
          data-tooltip={currentUser?.name}
        >
          <ImageWithFallback
            alt=""
            src={currentUser.image_path ?? ""}
            fallbackSrc={Images.AVATAR}
          />
        </div>

        <div className={`UserSetting__dropdown ${active ? "active" : ""}`}>
          <div className="Dropdown__wrapper" style={{ height: `${height}px` }}>
            <DropdownGroup
              name="main"
              active={activeMenu === "main"}
              setHeight={(num) => setHeight(num)}
            >
              <div className="UserSetting__dropdown__user">
                <Link to={`${PATH.ARTIST + "/" + currentUser?.id}`}>
                  <ImageWithFallback
                    alt=""
                    src={currentUser.image_path ?? ""}
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
              <DropdownItem
                iconLeft={<i className="fa-light fa-circle-user"></i>}
                title={t("Dropdown.main.Profile")}
              />
              <DropdownItem
                iconLeft={<i className="fa-light fa-upload"></i>}
                title={t("Dropdown.main.Upload")}
              />
              <hr />
              <DropdownItem
                iconLeft={<i className="fa-light fa-gear"></i>}
                title={t("Dropdown.main.Setting")}
                iconRight={<i className="fa-regular fa-chevron-right"></i>}
                func={() => setActiveMenu("settings")}
              />
              <DropdownItem
                func={() => setActiveMenu("language")}
                iconLeft={<i className="fa-sharp fa-light fa-globe"></i>}
                title={t("Dropdown.main.Language")}
                desc={locales[i18n.language]}
                iconRight={<i className="fa-regular fa-chevron-right"></i>}
              />
              <div className="UserSetting__dropdown__darkMode">
                <div className="UserSetting__dropdown__darkMode__label">
                  <i className="fa-light fa-moon"></i>
                  <h4>{t("Dropdown.main.DarkMode")}</h4>
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

              <hr />
              <DropdownItem
                iconLeft={<i className="fa-light fa-right-from-bracket"></i>}
                title={t("Dropdown.main.Logout")}
                func={() => handleClickLogout()}
              />
            </DropdownGroup>
            <DropdownGroup
              name="language"
              active={activeMenu === "language"}
              title={t("Dropdown.main.Language")}
              level={2}
              setHeight={(num) => setHeight(num)}
              func={() => setActiveMenu("main")}
            >
              <DropdownItem
                func={() => {
                  changeLanguage("en");
                }}
                iconLeft={
                  i18n.language === "en" ? (
                    <i className="fa-solid fa-circle-o"></i>
                  ) : (
                    <i className="fa-sharp fa-regular fa-circle"></i>
                  )
                }
                title={locales["en"]}
              />
              <DropdownItem
                func={() => {
                  changeLanguage("vi");
                }}
                iconLeft={
                  i18n.language === "vi" ? (
                    <i className="fa-solid fa-circle-o"></i>
                  ) : (
                    <i className="fa-sharp fa-regular fa-circle"></i>
                  )
                }
                title={locales["vi"]}
              />
            </DropdownGroup>
            <DropdownGroup
              name="settings"
              active={activeMenu === "settings"}
              title={t("Dropdown.main.Setting")}
              level={2}
              setHeight={(num) => setHeight(num)}
              func={() => setActiveMenu("main")}
            >
              <DropdownItem
                iconLeft={<i className="fa-light fa-user"></i>}
                title={"Account"}
                func={() => navigate(PATH.ACCOUNT + PATH.EDIT)}
              />

              <DropdownItem
                iconLeft={<i className="fa-light fa-bell"></i>}
                title={"Notification"}
                func={() => navigate(PATH.ACCOUNT)}
              />
              <DropdownItem
                iconLeft={<i className="fa-light fa-lock"></i>}
                title={"Change Password"}
                func={() => navigate(PATH.ACCOUNT)}
              />

              <DropdownItem
                iconLeft={<i className="fa-light fa-envelope"></i>}
                title={"Change Email"}
                func={() => navigate(PATH.ACCOUNT)}
              />
            </DropdownGroup>
          </div>
        </div>
      </div>
    )
  );
}

type propsDropdownGroup = {
  name: string;
  title?: string;
  level?: number;
  children: React.ReactNode;
  active: boolean;
  func?: () => void;
  setHeight: (height: number) => void;
};

const DropdownGroup = ({
  name,
  title,
  level = 1,
  children,
  active,
  setHeight,
  func, // Add the 'func' prop here
}: propsDropdownGroup) => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    active && setHeight(divRef.current?.clientHeight ?? 200);
  }, [active]);

  return (
    <div
      ref={divRef}
      className={`DropdownGroup ${active ? "active" : ""} ${
        "level-" + level.toString()
      }`}
    >
      {level && level > 1 && (
        <div className="DropdownGroup__header">
          <button
            onClick={() => {
              func && func(); // Check if 'func' exists before calling it
            }}
            className="button__back"
          >
            <i className="fa-regular fa-chevron-left"></i>
          </button>
          <h4>{title}</h4>
        </div>
      )}

      {children && children}
    </div>
  );
};

type propsDropdownItem = {
  iconLeft?: JSX.Element;
  title: string;
  desc?: string;
  iconRight?: JSX.Element;
  func?: () => void;
};

const DropdownItem = ({
  iconLeft,
  title,
  desc,
  iconRight,
  func,
}: propsDropdownItem) => {
  return (
    <div
      className="DropdownItem"
      onClick={() => {
        func && func();
      }}
    >
      {iconLeft ?? iconLeft}
      <div className="DropdownItem__body">
        <h4>{title}</h4>
        {desc && <span>{desc}</span>}
      </div>
      {iconRight ?? iconRight}
    </div>
  );
};
