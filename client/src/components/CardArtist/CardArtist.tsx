import React from "react";
import { Interface } from "readline";
import "./cardArtist.scss";

import Skeleton from "react-loading-skeleton";

interface CardProps {
  image: string;
  name: string;
  followers: string;
  loading?: boolean;
}

export default function CardArtist({ name, image, followers, loading = false }: CardProps) {
  return (
    <div className="CardArtist">
      <div className="CardArtist__container">
        <div className="CardArtist__container__image">
          {loading ? <Skeleton circle height={200} /> : <img src={image} alt="" />}
        </div>
        <div className="CardArtist__container__desc">
          <span className="CardArtist__container__desc__name">{loading ? <Skeleton /> : name}</span>
          <span className="CardArtist__container__desc__followers">
            {loading ? <Skeleton /> : `${followers} Follower`}
          </span>
          {loading ? (
            <Skeleton />
          ) : (
            <button className="CardArtist__container__desc__button">
              <i className="fa-regular fa-user-plus"></i>
              <span>Follow</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
