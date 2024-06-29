import moment from "moment";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import Images from "../../constants/images";
import IconPlay from "../IconPlay/IconPlay";
import "./style.scss";

import { useDispatch, useSelector } from "react-redux";
import { apiConfig } from "../../configs";
import {
  playSong,
  setNowPlaying,
  stopSong,
} from "../../slices/nowPlayingSlice";
import { RootState } from "../../store";
import { TSong } from "../../types";
import ImageWithFallback from "../ImageWithFallback";

interface TrackProps {
  song: TSong;
  number?: string;
  loading?: boolean;
}

export default function Track({ song, number, loading = false }: TrackProps) {
  const [like, setLike] = useState<boolean>(false);
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
              <h4>{number}</h4>
            </div>
          )}
          <div className="track__wrapper__left__image">
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
              {songPlay ? <IconPlay /> : <i className="fa-solid fa-play"></i>}
            </button>
          </div>
          <div className="track__wrapper__left__desc">
            <h4>{song?.title}</h4>
            {song?.author && (
              <div className="track__wrapper__left__desc__artist">
                <Link to={"/"}>{song?.author}</Link>
              </div>
            )}
          </div>
        </div>
        <div className="track__wrapper__center pc-2 m-0" style={{ flex: 1 }}>
          <span className="track__wrapper__center__date">
            {moment(song?.created_at).format("LL")}
          </span>
        </div>
        <div className="pc-2 t-2 m-0">
          <span className="track__wrapper__count">{song?.count ?? 0}</span>
        </div>
        <div className="track__wrapper__right pc-2 t-2 m-4">
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
            <span>10:10</span>
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
