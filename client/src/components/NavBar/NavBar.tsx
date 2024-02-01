import React from "react";
import "./navbar.scss";
import { PATH } from "../../constants/paths";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { changePath } from "./navbarSlide";

const navbar = [
  {
    title: "Discover",
    items: [
      { id: 1, title: "Home", icon: <i className="fa-light fa-house-blank"></i>, path: PATH.HOME },
      {
        id: 2,
        title: "Artist",
        icon: <i className="fa-light fa-user-music"></i>,
        path: PATH.ARTIST,
      },
      {
        id: 3,
        title: "Album",
        icon: <i className="fa-light fa-album-collection"></i>,
        path: PATH.ARTIST,
      },
      {
        id: 4,
        title: "Podcast",
        icon: <i className="fa-light fa-microphone"></i>,
        path: PATH.ARTIST,
      },
    ],
  },
  {
    title: "Library",
    items: [
      { id: 1, title: "Recent", icon: <i className="fa-light fa-clock"></i>, path: PATH.ARTIST },
      { id: 2, title: "Favourit", icon: <i className="fa-light fa-heart"></i>, path: PATH.ARTIST },
      { id: 3, title: "Playlist", icon: <i className="fa-light fa-music"></i>, path: PATH.ARTIST },
    ],
  },
  {
    title: "More",
    items: [
      { id: 1, title: "Setting", icon: <i className="fa-light fa-gear"></i>, path: PATH.ARTIST },
      {
        id: 2,
        title: "Account",
        icon: <i className="fa-light fa-circle-user"></i>,
        path: PATH.ARTIST,
      },
      {
        id: 3,
        title: "Logout",
        icon: <i className="fa-light fa-right-from-bracket"></i>,
        path: PATH.ARTIST,
      },
    ],
  },
];

export default function Navbar() {
  const path = useSelector((state: RootState) => state.navbar.value);
  const dispatch = useDispatch();

  const handleClick = (PATH: string) => {
    dispatch(changePath(PATH));
  };

  return (
    <aside className="navbar">
      <div className="navbar__logo">
        <i className="fa-regular fa-headphones-simple"></i>
        <h2>SOUND</h2>
      </div>
      <div className="navbar__content">
        {navbar.map((navbar, index) => (
          <div key={index} className="navbar__content__group">
            <h4 className="navbar__content__group__title">{navbar.title}</h4>
            <div className="navbar__content__group__list">
              {navbar.items.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`navbar__content__group__list__item ${
                    path === item.path ? "active" : ""
                  }`}
                  onClick={() => handleClick(item.path)}
                >
                  <div className="navbar__content__group__list__item__icon">{item.icon}</div>
                  <h4 className="navbar__content__group__list__item__title">{item.title}</h4>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
