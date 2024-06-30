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
  song: ResSoPaAr;
}

function CardSong({ className, song, loading = false }: CardSongProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`${PATH.SONG}/${song.id}`);
  };

  return (
    <div className={`CardSong ${className}`} onClick={handleClick}>
      <div className="CardSong__container">
        <div className="CardSong__container__image">
          {/* <div> */}
          <ImageWithFallback
            src={
              song.image_path
                ? apiConfig.imageURL(song.image_path)
                : Images.SONG
            }
            fallbackSrc={Images.SONG}
            alt=""
          />
          <div className="CardSong__container__image__button">
            <i className="fa-solid fa-play"></i>
          </div>
          {/* </div> */}
        </div>

        <div className="CardSong__container__desc">
          <div>
            <span className="CardSong__container__desc__title">
              {song?.title}
            </span>
          </div>
          <div className="CardSong__container__desc__info">
            <div className="CardSong__container__desc__info__artist">
              <Link to={"/"}>{song.author}</Link>
              {/* {artists &&
                  Array.isArray(artists) &&
                  artists.map((artist, index) => (
                    <Link key={index} to={`${PATH.ARTIST}/${artist.id}`}>
                      {artist.name}
                    </Link>
                  ))} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardSong;
