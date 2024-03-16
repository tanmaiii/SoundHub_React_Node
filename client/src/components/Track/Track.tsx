import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Skeleton from "react-loading-skeleton";

import moment from "moment";

import "./track.scss";
import { TSong } from "../../model";
import Images from "../../constants/images";
import apiConfig from "../../apis/apiConfig";
import { songApi } from "../../apis";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { QueryClient, useMutation, useQuery } from "react-query";
const queryClient = new QueryClient();

interface TrackProps {
  id?: number;
  number?: string;
  title: string;
  image?: string;
  artist: string[];
  time: string;
  dateAdd?: string;
  created_at?: string;
  loading?: boolean;
}

export default function Track({
  id = 1,
  title,
  image,
  artist,
  time,
  number,
  created_at,
  loading = false,
}: TrackProps) {
  const [like, setLike] = useState<boolean>(false);

  const checkLiked = async () => {
    try {
      const res = await songApi.checkLikedSong(id);
      console.log("chay lai ne", res);
      setLike(res.isLiked);
    } catch (error) {
      console.log(error);
    }
  };

  const { isLoading, isError } = useQuery(["like", id], () => {
    return checkLiked();
  });

  const likeMutation = useMutation(
    (like: boolean) => {
      if (!like) return songApi.likeSong(id);
      return songApi.unLikeSong(id);
    },
    {
      onSuccess: () => {
        setLike((currentLike) => !currentLike); // Cập nhật lại trạng thái like
        queryClient.invalidateQueries(["like", id]);
        queryClient.invalidateQueries("song-favourite");
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const handleClickLike = () => {
    return likeMutation.mutate(like);
  };

  loading = isLoading;

  return (
    <div className="track ">
      <div className="track__wrapper row">
        <div className="track__wrapper__left  pc-6 m-8">
          {number && (
            <div className="track__wrapper__left__number">
              <h4>{loading ? <Skeleton width={20} /> : number}</h4>
            </div>
          )}
          <div className="track__wrapper__left__image">
            {loading ? (
              <Skeleton height="100%" />
            ) : (
              <>
                <img src={image ? apiConfig.imageURL(image) : Images.POSTER} alt="" />
                <button className="button-play">
                  <i className="fa-solid fa-play"></i>
                </button>
              </>
            )}
          </div>
          <div className="track__wrapper__left__desc">
            <h4>{loading ? <Skeleton width={200} /> : title}</h4>
            <div className="track__wrapper__left__desc__artist">
              {loading ? (
                <Skeleton width={100} />
              ) : (
                artist.map((artist, i) => (
                  <Link key={i} to={"/"}>
                    {artist}
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="track__wrapper__center pc-3 m-0">
          <span className="track__wrapper__center__date">
            {loading ? <Skeleton width={80} /> : moment(created_at).format("LL")}
          </span>
        </div>
        <div className="track__wrapper__right pc-3 m-4">
          <div className="item__hover">
            <button className={`button-like ${like ? "active" : ""}`} onClick={handleClickLike}>
              {like ? <i className="fa-solid fa-heart"></i> : <i className="fa-light fa-heart"></i>}
            </button>
          </div>

          <div className="item__default">
            <span>{loading ? <Skeleton width={40} /> : time}</span>
          </div>

          <div className="item__hover">
            <button className="button-edit">
              <i className="fa-solid fa-ellipsis"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
