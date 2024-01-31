import React from "react";
import "./card.scss";

function Card(props: any) {
  return (
    <div className={`card, ${props?.className}`} style={{ maxWidth: props?.cardWidth }}>
      <div className="card__container">
        <div className="card__container__image">
          <img src={props?.image} alt="" style={{ width: props.card__containerWidth }} />
          <div className="card__container__image__button">
            <i className="fa-solid fa-play"></i>
          </div>
        </div>
        <div className="card__container__desc">
          <span className="card__container__desc__title">{props?.title}</span>
          <div className="card__container__desc__info">
            <span>{props?.artist}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
