import Skeleton from "react-loading-skeleton";
import { Link, useNavigate } from "react-router-dom";
import "./style.scss";

import { apiConfig } from "../../configs";
import Images from "../../constants/images";
import { PATH } from "../../constants/paths";
import { ResSoPaAr } from "../../types";
import ImageWithFallback from "../ImageWithFallback";
import { useEffect, useState } from "react";

export interface CardPlaylistProps {
  className?: string;
  loading?: boolean;
  playlist: ResSoPaAr;
}

function CardPlaylist({
  className,
  playlist,
  loading = false,
}: CardPlaylistProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`${PATH.PLAYLIST}/${playlist?.id}`);
  };

  return (
    <div onClick={handleClick} className={`CardPlaylist ${className}`}>
      <div className="CardPlaylist__container">
        <div className="CardPlaylist__container__image">
          {loading ? (
            <Skeleton height={200} />
          ) : (
            <div>
              <ImageWithFallback
                src={playlist?.image_path ?? ""}
                fallbackSrc={Images.PLAYLIST}
                alt=""
              />
            </div>
          )}
        </div>

        <div className="CardPlaylist__container__desc">
          <p>
            <span className="CardPlaylist__container__desc__title">
              {loading ? <Skeleton /> : playlist.title}
            </span>
          </p>
          <div className="CardPlaylist__container__desc__info">
            {loading ? (
              <Skeleton />
            ) : (
              <div className="CardPlaylist__container__desc__info__artist">
                <Link to={"/"}>{playlist.author}</Link>
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

export default CardPlaylist;
