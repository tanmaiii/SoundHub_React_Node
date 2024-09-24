import React, { useEffect, useRef, useState } from "react";

import UserSetting from "../UserSetting";

import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { changeOpen } from "../../slices/navbarSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PATH } from "../../constants/paths";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import CustomInput from "../CustomInput";
import ModalNotify from "../ModalNotify";
import Modal from "../Modal";

export default function Header() {
  const openMenu = useSelector((state: RootState) => state.navbar.openMenu);
  const headerRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const { t } = useTranslation("header");
  const { t: tSong } = useTranslation("song");
  const { t: tArtist } = useTranslation("artist");
  const navigation = useNavigate();
  const [keyword, setKeyword] = useState("");
  const { pathname } = useLocation();
  const [openModalNotify, setOpenModalNotify] = useState<boolean>(false);

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
    const pathParts = pathname.split("/");
    const targetValue = `/${pathParts[1]}`;

    if (keyword) {
      navigation(`${PATH.SEARCH}/${keyword}`);
    } else {
      targetValue === PATH.SEARCH && navigation(`${PATH.SEARCH}`);
    }
  }, [keyword]);

  return (
    <>
      <div className="header shrink" ref={headerRef}>
        <div className="header__left ">
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
            <CustomInput
              onSubmit={(text) => setKeyword(text)}
              placeholder={t("Search artist, title, ablum,...")}
            />
          </div>
        </div>
        <div className="header__right">
          {currentUser ? (
            <>
              <button
                className="header__right__upload"
                onClick={() => navigation(PATH.UPLOAD)}
                data-tooltip={"Upload"}
              >
                <i className="fa-regular fa-arrow-up-from-bracket"></i>
              </button>

              <button
                className="header__right__notify"
                onClick={() => setOpenModalNotify(true)}
                data-tooltip={t('Notification.title')}
              >
                <i className="fa-light fa-bell"></i>
                <div className="header__right__notify__num">
                  <span>20</span>
                </div>
              </button>
              <UserSetting />
            </>
          ) : (
            <>
              <Link to={PATH.SIGNUP}>
                <div className="header__right__signup">
                  <button className="btn__auth">{t("signup")}</button>
                </div>
              </Link>
              <Link to={PATH.LOGIN}>
                <div className="header__right__login">
                  <button className="btn__auth">{t("login")}</button>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>

      <Modal
        openModal={openModalNotify}
        setOpenModal={setOpenModalNotify}
        title={t('Notification.title')}
      >
        <ModalNotify onClose={() => setOpenModalNotify(false)} />
      </Modal>
    </>
  );
}
