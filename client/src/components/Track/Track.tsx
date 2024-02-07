import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./track.scss";


interface TrackProps {
  title: string;
  image: string;
  artist: string[];
  time: string;
}

export default function Track({ title, image, artist, time }: TrackProps) {
  const [like, setLike] = useState(false);

  return (
    <div className="track">
      <div className="track__wrapper">
        <div className="track__wrapper__left">
          <div className="track__wrapper__left__image">
            <img src={image} alt="" />
            <button className="button-play">
              <i className="fa-solid fa-play"></i>
            </button>
          </div>
          <div className="track__wrapper__left__desc">
            <h4>{title}</h4>
            <div className="track__wrapper__left__desc__artist">
              {artist.map((artist) => (
                <Link to={"/"}>{artist}</Link>
              ))}
            </div>
          </div>
        </div>
        <div className="track__wrapper__right">
          <div className="item__default">
            <span>{time}</span>
          </div>
          <div className="item__hover">
            <button
              className={`button-like ${like ? "active" : ""}`}
              onClick={() => setLike(!like)}
            >
              {like ? <i className="fa-solid fa-heart"></i> : <i className="fa-light fa-heart"></i>}
            </button>

            <button className="button-edit">
              <i className="fa-solid fa-ellipsis"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
