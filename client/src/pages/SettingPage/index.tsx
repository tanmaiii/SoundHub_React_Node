import React, { useEffect } from "react";
import { PATH } from "../../constants/paths";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import "./style.scss";
import Account from "./Account";
import Password from "./Password";

const SettingPage = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation("settings");
  const [nav, setNav] = React.useState(false);

  // const [active, setActive] = React.useState(1);

  const data = [
    {
      title: t("Account"),
      items: [
        {
          id: 1,
          title: t("Personal information"),
          icon: <i className="fa-thin fa-circle-user"></i>,
          path: PATH.SETTINGS + PATH.ACCOUNT,
          item: Account,
        },
        {
          id: 2,
          title: t("Password and security"),
          icon: <i className="fa-light fa-shield-halved"></i>,
          path: PATH.SETTINGS + PATH.CHANGE_PASSWORD,
          item: Password,
        },
        {
          id: 3,
          title: t("Identity verification"),
          icon: <i className="fa-sharp-duotone fa-light fa-badge-check"></i>,
          path: PATH.SETTINGS + PATH.VERIFY,
          item: Account,
        },
      ],
    },
    {
      title: t("Display mode"),
      items: [
        {
          id: 3,
          title: t("Notifications"),
          icon: <i className="fa-light fa-bell"></i>,
          path: PATH.SETTINGS + PATH.NOTIFY,
          item: Account,
        },
        {
          id: 4,
          title: t("Language"),
          icon: <i className="fa-sharp fa-light fa-globe"></i>,
          path: PATH.SETTINGS + PATH.LANGUAGES,
          item: Account,
        },
        {
          id: 4,
          title: t("Dark mode"),
          icon: <i className="fa-light fa-moon"></i>,
          path: PATH.SETTINGS + PATH.DARK_MODE,
          item: Account,
        },
      ],
    },
    {
      title: t("Other information and support"),
      items: [
        {
          id: 5,
          title: t("Help"),
          icon: <i className="fa-light fa-circle-question"></i>,
          path: PATH.SETTINGS + PATH.HELP,
          item: Account,
        },
        {
          id: 6,
          title: t("Account status"),
          icon: <i className="fa-light fa-user"></i>,
          path: PATH.SETTINGS + PATH.STATUS,
          item: Account,
        },
      ],
    },
  ];

  useEffect(() => {
    const pathParts = pathname.split("/");
    const targetValue = pathParts[2];
    console.log(targetValue === undefined);
    console.log(targetValue);
    
    setNav(targetValue === undefined);
  }, [pathname]);

  return (
    <div className="SettingPage">
      <div className="SettingPage__wrapper row no-gutters">
        <div className={`col pc-2 t-3 ${nav ? "m-12" : "m-0"}`}>
          <div className="SettingPage__wrapper__nav">
            <div className="SettingPage__wrapper__nav__header">
              <h4>{t("settings.title")}</h4>
            </div>
            <div className="SettingPage__wrapper__nav__body">
              {data.map((navbar, index) => (
                <div
                  key={index}
                  className="SettingPage__wrapper__nav__body__group"
                >
                  <h4 className="SettingPage__wrapper__nav__body__group__title">
                    {navbar.title}
                  </h4>
                  <div className="SettingPage__wrapper__nav__body__group__list">
                    {navbar.items.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        className={`SettingPage__wrapper__nav__body__group__list__item ${
                          pathname === item.path ? "active" : ""
                        }`}
                      >
                        <div className="SettingPage__wrapper__nav__body__group__list__item__icon">
                          {item.icon}
                        </div>
                        <h4
                          className={`SettingPage__wrapper__nav__body__group__list__item__title`}
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
        <div className={`col pc-10 t-9 ${nav ? "m-0" : "m-12"}`}>
          <div className="SettingPage__wrapper__content">
            {data.map((navbar, index) =>
              navbar.items.map((item, index) =>
                pathname === item.path ? <item.item key={index} /> : null
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
