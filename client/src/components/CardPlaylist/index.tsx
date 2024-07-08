import Skeleton from "react-loading-skeleton";
import { Link, useNavigate } from "react-router-dom";
import "./style.scss";

import { apiConfig } from "../../configs";
import Images from "../../constants/images";
import { PATH } from "../../constants/paths";
import { ResSoPaAr } from "../../types";
import ImageWithFallback from "../ImageWithFallback";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { playlistApi } from "../../apis";
import { useAuth } from "../../context/authContext";

export interface CardPlaylistProps {
  className?: string;
  loading?: boolean;
  // playlist: ResSoPaAr;
  id?: string;
  image?: string;
  title: string | undefined;
  author: string | undefined;
  userId: string;
  isPublic: number;
}

function CardPlaylist({
  className,
  id,
  image,
  title,
  author,
  userId,
  isPublic,
  loading = false,
}: CardPlaylistProps) {
  const navigate = useNavigate();
  const { token, currentUser } = useAuth();
  const queryClient = useQueryClient();

  const handleClick = () => {
    id && navigate(`${PATH.PLAYLIST}/${id}`);
  };

  const { data: isLike } = useQuery({
    queryKey: ["like-playlist", id],
    queryFn: async () => {
      const res = await playlistApi.checkLikedPlaylist(id ?? "", token);
      return res.isLiked;
    },
  });

  const mutationLike = useMutation({
    mutationFn: (like: boolean) => {
      if (like) return playlistApi.unLikePlaylist(id ?? "", token);
      return playlistApi.likePlaylist(id ?? "", token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlist-count", id] });
      queryClient.invalidateQueries({ queryKey: ["like-playlist", id] });
      queryClient.invalidateQueries({ queryKey: ["all-favorites"] });
      queryClient.invalidateQueries({ queryKey: ["playlists-favorites"] });
    },
  });

  const handleRemove = () => {};

  return (
    <div className={`CardPlaylist ${className}`}>
      <div className="CardPlaylist__container">
        <div className="CardPlaylist__container__image">
          {loading ? (
            <Skeleton height={200} />
          ) : (
            <>
                <ImageWithFallback
                  src={image ?? ""}
                  fallbackSrc={Images.PLAYLIST}
                  alt=""
                />
              <div
                className="CardPlaylist__container__image__swapper"
                onClick={handleClick}
              ></div>
              {currentUser?.id === userId ? (
                <button className="btn__remove" onClick={handleRemove}>
                  <i className="fa-light fa-trash-can"></i>
                </button>
              ) : (
                <button
                  className={`btn__like ${isLike ? "active" : ""}`}
                  onClick={() => mutationLike.mutate(isLike ?? false)}
                >
                  {isLike ? (
                    <i className="fa-solid fa-heart"></i>
                  ) : (
                    <i className="fa-light fa-heart"></i>
                  )}
                </button>
              )}
            </>
          )}
        </div>

        <div className="CardPlaylist__container__desc">
          <p>
            {isPublic === 0 && (
              <i className="icon__private fa-light fa-lock"></i>
            )}
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
                <Link to={`${PATH.ARTIST}/${userId}`}>{author}</Link>
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
