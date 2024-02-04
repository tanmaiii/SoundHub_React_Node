import React from "react";
import { Link } from "react-router-dom";
import "./card.scss";

function Card(props: any) {
  return (
    <div className={`card ${props?.className}`}>
      <div className="card__container">
        <div className="card__container__image">
          <img src={props?.image} alt="" />
          <div className="card__container__image__button">
            <i className="fa-solid fa-play"></i>
          </div>
        </div>
        <div className="card__container__desc">
          <span className="card__container__desc__title">{props?.title}</span>
          <div className="card__container__desc__info">
            <Link to={"/"}>
              <span>{props?.artist}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
