import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import moment from "moment";
import "./track.scss";
import Images from "../../constants/images";
import { songApi } from "../../apis";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import IconPlay from "../IconPlay/IconPlay";

import {
  selectIsPlaying,
  setNowPlaying,
  playSong,
  stopSong,
} from "../../slices/nowPlayingSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { apiConfig } from "../../configs";
import ImageWithFallback from "../ImageWithFallback";
import { TSong } from "../../types";

interface TrackProps {
  song: TSong;
  number?: string;
  loading?: boolean;
}

export default function Track({ song, number, loading = false }: TrackProps) {
  const [like, setLike] = useState<boolean>(false);
  const [countListen, setCountListen] = useState(100);
  const queryClient = useQueryClient();
  const [songPlay, setSongPlay] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { isPlaying, songPlayId } = useSelector(
    (state: RootState) => state.nowPlaying
  );

  const checkLiked = async () => {
    try {
      // const res = await songApi.checkLikedSong(id);
      // setLike(res.isLiked);
    } catch (error) {
      console.log(error);
    }
  };

  const { isLoading, isError } = useQuery(["like", song?.id], () => {
    return checkLiked();
  });

  const likeMutation = useMutation(
    async (like: boolean) => {
      //if (!like) return songApi.likeSong(id);
      //return songApi.unLikeSong(id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["likePlaying", song?.id]);
        queryClient.invalidateQueries(["like", song?.id]);
        queryClient.invalidateQueries(["songs-like"]);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const handleClickLike = () => {
    return likeMutation.mutate(like);
  };

  const handleClickPlay = (id: string) => {
    if (songPlayId == id && isPlaying) {
      dispatch(stopSong());
      console.log("dừng", song?.id, isPlaying);
    } else {
      dispatch(setNowPlaying({ id }));
      dispatch(playSong());
      console.log("chơi", id, isPlaying);
    }
  };

  useEffect(() => {
    setSongPlay(songPlayId === song?.id && isPlaying);
  }, [isPlaying, songPlayId]);

  loading = isLoading;

  return (
    <div className="track">
      <div
        className={`track__wrapper row ${
          songPlayId === song?.id ? "active" : ""
        }`}
      >
        <div className="track__wrapper__left pc-6 m-8">
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
                <ImageWithFallback
                  src={
                    song?.image_path
                      ? apiConfig.imageURL(song?.image_path)
                      : Images.SONG
                  }
                  fallbackSrc={Images.SONG}
                  alt=""
                />
                <button
                  className={`button-play ${
                    songPlayId === song?.id ? "active" : ""
                  }`}
                  onClick={() => handleClickPlay(song?.id)}
                >
                  {songPlay ? (
                    <IconPlay />
                  ) : (
                    <i className="fa-solid fa-play"></i>
                  )}
                </button>
              </>
            )}
          </div>
          <div className="track__wrapper__left__desc">
            <h4>{loading ? <Skeleton width={200} /> : song?.title}</h4>
            {song?.author && (
              <div className="track__wrapper__left__desc__artist">
                {loading ? (
                  <Skeleton width={100} />
                ) : (
                  <Link to={"/"}>{song?.author}</Link>
                )}
              </div>
            )}
            {countListen && (
              <div className="track__wrapper__left__desc__quantity">
                {loading ? (
                  <Skeleton width={100} />
                ) : (
                  <span>{countListen}</span>
                )}
              </div>
            )}
          </div>
        </div>
        {song?.created_at && (
          <div className="track__wrapper__center pc-3 m-0">
            <span className="track__wrapper__center__date">
              {loading ? (
                <Skeleton width={80} />
              ) : (
                moment(song?.created_at).format("LL")
              )}
            </span>
          </div>
        )}
        <div className="track__wrapper__right pc-3 m-4">
          <div className="item__hover">
            <button
              className={`button-like ${like ? "active" : ""}`}
              onClick={handleClickLike}
            >
              {like ? (
                <i className="fa-solid fa-heart"></i>
              ) : (
                <i className="fa-light fa-heart"></i>
              )}
            </button>
          </div>

          <div className="item__default">
            <span>{loading ? <Skeleton width={40} /> : "10:10"}</span>
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
