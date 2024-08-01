import React, { HtmlHTMLAttributes, useEffect, useRef, useState } from "react";
import "./navbar.scss";
import { PATH } from "../../constants/paths";
import Images from "../../constants/images";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { changeOpen, changePath } from "../../slices/navbarSlice";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const path = useSelector((state: RootState) => state.navbar.path);
  const openMenu = useSelector((state: RootState) => state.navbar.openMenu);
  const navbarRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation("home");
  const { pathname } = useLocation();

  const navbar = [
    {
      title: "",
      items: [
        {
          id: 1,
          title: t("navbar.home"),
          icon: <i className="fa-light fa-house-blank"></i>,
          path: PATH.HOME,
        },
        {
          id: 2,
          title: t("navbar.search"),
          icon: <i className="fa-light fa-magnifying-glass"></i>,
          path: PATH.SEARCH,
        },
      ],
    },
    {
      title: "",
      items: [
        {
          id: 3,
          title: t("navbar.artists"),
          icon: <i className="fa-light fa-user-music"></i>,
          path: PATH.MY_ARTIST,
        },
        {
          id: 4,
          title: t("navbar.playlist"),
          icon: <i className="fa-light fa-album"></i>,
          path: PATH.MY_PLAYLIST,
        },
        {
          id: 5,
          title: t("navbar.favourites"),
          icon: <i className="fa-light fa-heart"></i>,
          path: PATH.FAVOURITE,
        },
        {
          id: 6,
          title: t("navbar.recently"),
          icon: <i className="fa-light fa-clock"></i>,
          path: PATH.RECENTLY,
        },
      ],
    },
  ];

  const dispatch = useDispatch();

  const handleClick = (PATH: string) => {
    dispatch(changePath(PATH));
  };

  useEffect(() => {
    const pathParts = pathname.split("/");
    const targetValue = `/${pathParts[1]}`;
    dispatch(changePath(targetValue));
  }, [pathname]);

  useEffect(() => {
    function handleMousedown(event: MouseEvent) {
      const node = event.target as Node;
      if (!navbarRef.current?.contains(node)) {
        dispatch(changeOpen(false));
      }
    }
    document.addEventListener("mousedown", (event) => handleMousedown(event));
    return () =>
      document.removeEventListener("mousedown", (event) =>
        handleMousedown(event)
      );
  });

  return (
    <div ref={navbarRef} className={`navbar ${openMenu ? "openMenu" : ""}`}>
      <div className="navbar__container">
        <div className="navbar__container__top">
          <Link to={PATH.HOME} className={`navbar__container__top__logo`}>
            <img src={Images.LOGO} alt="" />
            <h2>{t("navbar.logo")}</h2>
          </Link>
        </div>

        <div className={`navbar__container__content`}>
          {navbar.map((navbar, index) => (
            <div key={index} className="navbar__container__content__group">
              {/* <h4 className="navbar__container__content__group__title">
                {navbar.title}
              </h4> */}
              <hr />
              <div className="navbar__container__content__group__list">
                {navbar.items.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className={`navbar__container__content__group__list__item ${
                      path === item.path ? "active" : ""
                    }`}
                    onClick={() => handleClick(item.path)}
                  >
                    <div className="navbar__container__content__group__list__item__icon">
                      {item.icon}
                    </div>
                    <h4
                      className={`navbar__container__content__group__list__item__title`}
                    >
                      {item.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
