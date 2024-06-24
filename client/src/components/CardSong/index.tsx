import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style.scss";
import Skeleton from "react-loading-skeleton";

import { PATH } from "../../constants/paths";
import Images from "../../constants/images";
import { TSong, TUser } from "../../types";
import { apiConfig } from "../../configs";
import ImageWithFallback from "../ImageWithFallback";

export interface CardSongProps {
  className?: string;
  loading?: boolean;
  song: TSong;
}

function CardSong({ className, song, loading = false }: CardSongProps) {
  const navigate = useNavigate();
  const [artists, setArtists] = useState<TUser[] | []>([]);

  useEffect(() => {
    const getAllArtist = async () => {
      try {
        // const res = await songApi.getAllArtistInSong(song.id);
        // res && setArtists(res);
      } catch (error) {
        console.log(error);
      }
    };
    getAllArtist();
  }, []);

  return (
    <div className={`CardSong ${className}`}>
      <div className="CardSong__container">
        <div className="CardSong__container__image">
          {loading ? (
            <Skeleton height={200} />
          ) : (
            <Link target="_blank" to={`${PATH.SONG}/${song.id}`}>
              <ImageWithFallback 
                src={song.image_path ? apiConfig.imageURL(song.image_path) : Images.POSTER}
                fallbackSrc={Images.POSTER}
                alt=""
              />
              <div className="CardSong__container__image__button">
                <i className="fa-solid fa-play"></i>
              </div>
            </Link>
          )}
        </div>

        <div className="CardSong__container__desc">
          <Link target="_blank" to={`${PATH.SONG}/${"123123"}`}>
            <span className="CardSong__container__desc__title">
              {loading ? <Skeleton /> : song.title}
            </span>
          </Link>
          <div className="CardSong__container__desc__info">
            {loading ? (
              <Skeleton />
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardSong;
