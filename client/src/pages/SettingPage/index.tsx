import React from "react";
import { PATH } from "../../constants/paths";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./style.scss";

const SettingPage = () => {
  const { t } = useTranslation();

  const data = [
    {
      title: "Cách bạn dùng Instagram",
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
      title: "Ai có thể xem nội dung của bạn",
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
    {
      title: "Ai có thể xem nội dung của bạn",
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
    {
      title: "Ai có thể xem nội dung của bạn",
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

  return (
    <div className="SettingPage">
      <div className="SettingPage__wrapper">
        <div className="SettingPage__wrapper__header">
          <h4>Cài đặt</h4>
        </div>
        <div className="SettingPage__wrapper__body">
          {data.map((navbar, index) => (
            <div key={index} className="SettingPage__wrapper__body__group">
              <h4 className="SettingPage__wrapper__body__group__title">
                {navbar.title}
              </h4>
              <div className="SettingPage__wrapper__body__group__list">
                {navbar.items.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className={`SettingPage__wrapper__body__group__list__item`}
                  >
                    <div className="SettingPage__wrapper__body__group__list__item__icon">
                      {item.icon}
                    </div>
                    <h4
                      className={`SettingPage__wrapper__body__group__list__item__title`}
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
};

export default SettingPage;
