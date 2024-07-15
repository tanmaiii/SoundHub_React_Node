import moment from "moment";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import Images from "../../constants/images";
import IconPlay from "../IconPlay/IconPlay";
import "./style.scss";

import { useDispatch, useSelector } from "react-redux";
import { songApi } from "../../apis";
import { PATH } from "../../constants/paths";
import { useAuth } from "../../context/authContext";
import {
  playSong,
  setNowPlaying,
  stopSong,
} from "../../slices/nowPlayingSlice";
import { RootState } from "../../store";
import { TSong } from "../../types";
import ImageWithFallback from "../ImageWithFallback";
import SongMenu from "../Menu/SongMenu";

interface TrackProps {
  song: TSong;
  number?: string;
  loading?: boolean;
}

export default function Track({ song, number, loading = false }: TrackProps) {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { token, currentUser } = useAuth();
  const [activeMenu, setActiveMenu] = useState(false);

  const { isPlaying, songPlayId } = useSelector(
    (state: RootState) => state.nowPlaying
  );

  const handleClickPlay = (id: string) => {
    if (songPlayId === id && isPlaying) {
      dispatch(stopSong());
    } else {
      dispatch(setNowPlaying({ id }));
      dispatch(playSong());
    }
  };

  const { data: isLike, refetch: refetchLike } = useQuery({
    queryKey: ["like-song", song?.id],
    queryFn: async () => {
      const res = await songApi.checkLikedSong(song?.id ?? "", token);
      return res.isLiked;
    },
  });

  const mutationLike = useMutation({
    mutationFn: (like: boolean) => {
      if (like) return songApi.unLikeSong(song?.id ?? "", token);
      return songApi.likeSong(song?.id ?? "", token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["like-song", song?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["songs-favorites", currentUser?.id],
      });
    },
  });

  return (
    <div
      className="track"
    >
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
              src={song?.image_path ?? ""}
              fallbackSrc={Images.SONG}
              alt=""
            />
            <button
              className={`button-play ${
                songPlayId === song?.id ? "active" : ""
              }`}
              onClick={() => handleClickPlay(song?.id)}
            >
              {false ? <IconPlay /> : <i className="fa-solid fa-play"></i>}
            </button>
          </div>
          <div className="track__wrapper__left__desc">
            <Link to={`${PATH.SONG}/${song.id}`}>
              <h4 className="track__wrapper__left__desc__title">
                {song?.title}
              </h4>
            </Link>
            {song?.author && (
              <div className="track__wrapper__left__desc__artists">
                <Link to={`${PATH.ARTIST}/${song?.user_id}`}>
                  {song?.author}
                </Link>
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
          <span className="track__wrapper__count">
            {song?.count_listen ?? 0}
          </span>
        </div>
        <div className="track__wrapper__right pc-2 t-2 m-4">
          <div className="item__hover">
            <button
              className={`button-like ${isLike ? "active" : ""}`}
              onClick={() => mutationLike.mutate(isLike ?? false)}
            >
              {isLike ? (
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
            <div className={`button-edit ${activeMenu ? " active" : ""}`}>
              <SongMenu
                id={song?.id}
                active={activeMenu}
                onOpen={() => setActiveMenu(true)}
                onClose={() => setActiveMenu(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
