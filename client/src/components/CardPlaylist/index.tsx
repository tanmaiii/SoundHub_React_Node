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
  // playlist: ResSoPaAr;
  id?: string;
  image?: string;
  title: string | undefined;
  author: string | undefined;
  userId: string;
}

function CardPlaylist({
  className,
  id,
  image,
  title,
  author,
  userId,
  loading = false,
}: CardPlaylistProps) {
  const navigate = useNavigate();

  return (
    <div className={`CardPlaylist ${className}`}>
      <div className="CardPlaylist__container">
        <Link
          to={`${PATH.PLAYLIST}/${id}`}
          className="CardPlaylist__container__image"
        >
          {loading ? (
            <Skeleton height={200} />
          ) : (
            <div>
              <ImageWithFallback
                src={image ?? ""}
                fallbackSrc={Images.PLAYLIST}
                alt=""
              />
            </div>
          )}
        </Link>

        <div className="CardPlaylist__container__desc">
          <p>
            <Link
              to={`${PATH.PLAYLIST}/${id}`}
              className="CardPlaylist__container__desc__title"
            >
              {loading ? <Skeleton /> : title}
            </Link>
          </p>
          <div className="CardPlaylist__container__desc__info">
            {loading ? (
              <Skeleton />
            ) : (
              <div className="CardPlaylist__container__desc__info__artist">
                <Link to={`${PATH.PLAYLIST}/${userId}`}>{author}</Link>
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
