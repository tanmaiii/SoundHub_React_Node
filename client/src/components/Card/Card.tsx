import React from "react";
import { Link } from "react-router-dom";
import "./card.scss";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export interface CardProps {
  className?: string;
  image: string;
  title: string;
  artist: string;
  loading?: boolean;
}

function Card({ className, image, title, artist, loading = false }: CardProps) {
  return (
    <div className={`card ${className}`}>
      <div className="card__container">
        <div className="card__container__image">
          {loading ? (
            <Skeleton height={200} />
          ) : (
            <>
              <img src={image} alt="" />
              <div className="card__container__image__button">
                <i className="fa-solid fa-play"></i>
              </div>
            </>
          )}
        </div>

        <div className="card__container__desc">
          <span className="card__container__desc__title">{loading ? <Skeleton /> : title}</span>
          <div className="card__container__desc__info">
            <Link to={"/"}>
              <span>{loading ? <Skeleton /> : artist}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
