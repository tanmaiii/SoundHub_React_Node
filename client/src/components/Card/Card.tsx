import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./card.scss";
import { TUser } from "../../model/user";

import Skeleton from "react-loading-skeleton";

import { PATH } from "../../constants/paths";
import Images from "../../constants/images";
import { songApi } from "../../apis";
import apiConfig from "../../apis/apiConfig";
import { TSong } from "../../model";

export interface CardProps {
  className?: string;
  loading?: boolean;
  song: TSong;
}

function Card({ className, song, loading = false }: CardProps) {
  const navigate = useNavigate();
  const [artists, setArtists] = useState<TUser[] | []>([]);

  useEffect(() => {
    const getAllArtist = async () => {
      try {
        const res = await songApi.getAllArtistInSong(song.id);
        res && setArtists(res);
      } catch (error) {
        console.log(error);
      }
    };
    getAllArtist();
  }, []);

  return (
    <div className={`card ${className}`}>
      <div className="card__container">
        <div className="card__container__image">
          {loading ? (
            <Skeleton height={200} />
          ) : (
            <Link target="_blank" to={`${PATH.SONG}/${song.id}`}>
              <img
                src={song.image_path ? apiConfig.imageURL(song.image_path) : Images.POSTER}
                alt=""
              />
              <div className="card__container__image__button">
                <i className="fa-solid fa-play"></i>
              </div>
            </Link>
          )}
        </div>

        <div className="card__container__desc">
          <Link target="_blank" to={`${PATH.SONG}/${"123123"}`}>
            <span className="card__container__desc__title">
              {loading ? <Skeleton /> : song.title}
            </span>
          </Link>
          <div className="card__container__desc__info">
            {loading ? (
              <Skeleton />
            ) : (
              <div className="card__container__desc__info__artist">
                <Link to={"/"}>{song.author}</Link>
                {/* {artists &&
                  Array.isArray(artists) &&
                  artists.map((artist, index) => (
                    <Link key={index} to={`${PATH.ARTIST}/${artist.id}`}>
                      {artist.name}
                    </Link>
                  ))} */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
