import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.scss";
import Skeleton from "react-loading-skeleton";

import { PATH } from "../../constants/paths";
import Images from "../../constants/images";
import { TSong, TUser, ResSoPaAr } from "../../types";
import { apiConfig } from "../../configs";
import ImageWithFallback from "../ImageWithFallback";

export interface CardSongProps {
  className?: string;
  loading?: boolean;
  // song: ResSoPaAr;
  id?: string;
  image?: string;
  title: string | undefined;
  author: string | undefined;
  userId: string;
  isPublic?: number;
}

function CardSong({
  className,
  loading = false,
  id,
  image,
  title,
  author,
  userId,
  isPublic = 0,
}: CardSongProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    id && navigate(`${PATH.SONG}/${id}`);
  };

  return (
    <div className={`CardSong ${className}`}>
      <div className="CardSong__container">
        <div className="CardSong__container__image" onClick={handleClick}>
          {loading ? (
            <Skeleton height={180} width={"100%"} />
          ) : (
            <>
              <ImageWithFallback
                src={image ?? ""}
                fallbackSrc={Images.SONG}
                alt=""
              />
              <div className="CardSong__container__image__button">
                <i className="fa-solid fa-play"></i>
              </div>
            </>
          )}
        </div>

        <div className="CardSong__container__desc">
          {loading ? (
            <Skeleton height={24} />
          ) : (
            <p>
              {isPublic === 0 && (
                <i className="icon__private fa-light fa-lock"></i>
              )}
              <h4
                onClick={handleClick}
                className="CardSong__container__desc__title"
              >
                {title}
              </h4>
            </p>
          )}
          <div className="CardSong__container__desc__info">
            <div className="CardSong__container__desc__info__artist">
              {loading ? (
                <Skeleton height={18} />
              ) : (
                <Link to={`${PATH.ARTIST}/${userId}`}>{author}</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardSong;
