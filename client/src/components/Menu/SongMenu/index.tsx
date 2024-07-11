import React, { useEffect, useRef, useState } from "react";
import "./style.scss";
import { useTranslation } from "react-i18next";

type Props = {
  id: string;
  active: boolean;
  placement?: "top-start" | "bottom-start" | "top-end" | "bottom-end";
  onOpen: () => void;
  onClose: () => void;
};

const SongMenu = ({
  id,
  active,
  onOpen,
  onClose,
  placement = "bottom-end",
}: Props) => {
  const { t } = useTranslation("song");
  // const [activeMenu, setActiveMenu] = useState(false);
  const SongMenuRef = useRef<HTMLDivElement>(null);

  const data = [
    {
      title: t("Menu.Add to playlist"),
      icon: <i className="fa-solid fa-plus"></i>,
      func: () => console.log("Add to playlist"),
    },
    {
      title: t("Menu.Add to favorites list"),
      icon: <i className="fa-regular fa-circle-plus"></i>,
      func: () => console.log("Add to playlist"),
    },
    {
      title: t("Menu.Add to waiting list"),
      icon: <i className="fa-regular fa-list-music"></i>,
      func: () => console.log("Add to playlist"),
    },
    {
      title: t("Menu.See details"),
      icon: <i className="fa-regular fa-music"></i>,
      func: () => console.log("Add to playlist"),
    },
    {
      title: t("Menu.Artist Access"),
      icon: <i className="fa-regular fa-user"></i>,
      func: () => console.log("Add to playlist"),
    },
    {
      title: t("Menu.Share"),
      icon: <i className="fa-solid fa-share"></i>,
      func: () => console.log("Add to playlist"),
    },
  ];

  useEffect(() => {
    const handleMousedown = (e: MouseEvent) => {
      if (
        SongMenuRef.current &&
        !SongMenuRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleMousedown);
    return () => document.removeEventListener("mousedown", handleMousedown);
  });

  return (
    <div ref={SongMenuRef} className={`SongMenu`}>
      <button
        className="SongMenu__button"
        onClick={() => {
          active ? onClose() : onOpen();
        }}
      >
        <i className="fa-solid fa-ellipsis"></i>
      </button>

      <div
        className={`SongMenu__context ${active ? "active" : ""}`}
        data-placement={placement}
      >
        <ul className="SongMenu__context__list">
          {data.map((item, index) => {
            return (
              <li key={index} className="SongMenu__context__list__item">
                <button>
                  {item.icon}
                  <span>{item.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SongMenu;
