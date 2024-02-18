import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./card.scss";

import Skeleton from "react-loading-skeleton";

import { PATH } from "../../constants/paths";

export interface CardProps {
  className?: string;
  image: string;
  title: string;
  artist: string[];
  loading?: boolean;
}

function Card({ className, image, title, artist, loading = false }: CardProps) {
  const navigate = useNavigate();

  return (
    <div className={`card ${className}`}>
      <div className="card__container">
        <div className="card__container__image">
          {loading ? (
            <Skeleton height={200} />
          ) : (
            <Link target="_blank" to={`${PATH.SONG}/${"123123"}`}>
              <img src={image} alt="" />
              <div className="card__container__image__button">
                <i className="fa-solid fa-play"></i>
              </div>
            </Link>
          )}
        </div>

        <div className="card__container__desc">
          <Link target="_blank" to={`${PATH.SONG}/${"123123"}`}>
            <span className="card__container__desc__title">{loading ? <Skeleton /> : title}</span>
          </Link>
          <div className="card__container__desc__info">
            {loading ? (
              <Skeleton />
            ) : (
              <div className="card__container__desc__info__artist">
                {artist.map((artist, index) => (
                  <Link key={index} to={"/"}>
                    {artist}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
