import React from "react";
import { Interface } from "readline";
import "./cardArtist.scss";

interface CardProps {
  image: string;
  name: string;
  followers: string;
}

export default function CardArtist({ name, image, followers }: CardProps) {
  return (
    <div className="CardArtist">
      <div className="CardArtist__container">
        <div className="CardArtist__container__image">
          <img src={image} alt="" />
        </div>
        <div className="CardArtist__container__desc">
          <span className="CardArtist__container__desc__name">{name}</span>
          <span className="CardArtist__container__desc__followers">{followers} Follower</span>
          <button className="CardArtist__container__desc__button">
            <i className="fa-regular fa-user-plus"></i>
            <span>Follow</span>
          </button>
        </div>
      </div>
    </div>
  );
}
