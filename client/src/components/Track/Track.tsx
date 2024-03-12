import React, { useState } from "react";
import { Link } from "react-router-dom";

import Skeleton from "react-loading-skeleton";

import "./track.scss";

interface TrackProps {
  number?: string;
  title: string;
  image: string;
  artist: string[];
  time: string;
  dateAdd?: string;
  loading?: boolean;
}

export default function Track({
  title,
  image,
  artist,
  time,
  number,
  dateAdd,
  loading = false,
}: TrackProps) {
  const [like, setLike] = useState(false);

  return (
    <div className="track">
      <div className="track__wrapper">
        <div className="track__wrapper__left">
          {number && (
            <div className="track__wrapper__left__number">
              <h4>{loading ? <Skeleton width={20} /> : number}</h4>
            </div>
          )}
          <div className="track__wrapper__left__image">
            {loading ? (
              <Skeleton height="100%" />
            ) : (
              <>
                <img src={image} alt="" />
                <button className="button-play">
                  <i className="fa-solid fa-play"></i>
                </button>
              </>
            )}
          </div>
          <div className="track__wrapper__left__desc">
            <h4>{loading ? <Skeleton width={200} /> : title}</h4>
            <div className="track__wrapper__left__desc__artist">
              {loading ? (
                <Skeleton width={100} />
              ) : (
                artist.map((artist, i) => <Link key={i} to={"/"}>{artist}</Link>)
              )}
            </div>
          </div>
        </div>
        <div className="track__wrapper__center">
          <span className="track__wrapper__center__date">
            {loading ? <Skeleton width={80} /> : dateAdd}
          </span>
        </div>
        <div className="track__wrapper__right">
          <div className="item__hover">
            <button
              className={`button-like ${like ? "active" : ""}`}
              onClick={() => setLike(!like)}
            >
              {like ? <i className="fa-solid fa-heart"></i> : <i className="fa-light fa-heart"></i>}
            </button>
          </div>

          <div className="item__default">
            <span>{loading ? <Skeleton width={40} /> : time}</span>
          </div>

          <div className="item__hover">
            <button className="button-edit">
              <i className="fa-solid fa-ellipsis"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
