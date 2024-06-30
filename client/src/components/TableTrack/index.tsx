import React, { useState } from "react";
import "./style.scss";
import { TSong } from "../../types";
import Track from "../Track";

type props = {
  songs: TSong[] | null;
  isLoading?: boolean;
};

const TableTrack = ({ songs, isLoading = false }: props) => {
  const [activeDropdown, setActiveDropdown] = useState<boolean>(false);

  return (
    <div className="table__track">
      <div className="table__track__header">
        <div className="table__track__header__left">
          <button className="btn__play">
            <i className="fa-solid fa-play"></i>
          </button>
          <button>
            <i className="fa-light fa-heart"></i>
          </button>
          <button>
            <i className="fa-solid fa-ellipsis"></i>
          </button>
        </div>
        <div className="table__track__header__right">
          <div className="dropdown">
            <div
              className="dropdown__header"
              onClick={() => setActiveDropdown(!activeDropdown)}
            >
              <i className="fa-light fa-bars-sort"></i>
              <span>Mới nhất</span>
              <i className="fa-light fa-chevron-down"></i>
            </div>
            <div
              className={`dropdown__content ${activeDropdown ? "active" : ""}`}
            >
              <ul>
                <li>Mới nhất</li>
                <li>Phổ biến</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="table__track__body">
        <div className="table__track__body__header">
          <div className="table__track__body__header__line1 pc-6 m-8">
            <span className="count">#</span>
            <span className="title">Title</span>
          </div>
          <div className="table__track__body__header__line2 pc-2 m-0">
            <span>Date Add</span>
          </div>
          <div className="table__track__body__header__line3 pc-2 t-2 m-0">
            <span>Listen</span>
          </div>
          <div className="table__track__body__header__line4 pc-2 t-2 m-4">
            <span>Time</span>
          </div>
        </div>
        <div className="table__track__body__list">
          {songs &&
            songs.map((song, index) => (
              <Track song={song} loading={isLoading} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default TableTrack;
