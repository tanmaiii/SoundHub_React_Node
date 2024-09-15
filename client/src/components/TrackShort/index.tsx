import React, { useState } from "react";
import { TSong } from "../../types";
import "./style.scss";
import SongMenu from "../Menu/SongMenu";
import ImageWithFallback from "../ImageWithFallback";
import Images from "../../constants/images";
import numeral from "numeral";
import { Link } from "react-router-dom";
import { PATH } from "../../constants/paths";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { songApi } from "../../apis";
import { useAuth } from "../../context/AuthContext";
import { useAudio } from "../../context/AudioContext";
import IconPlay from "../IconPlay/IconPlay";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { closeMenu, openMenu } from "../../slices/menuSongSlide";

type props = {
  id: string;
  number?: number;
  loading?: boolean;
};

function TrackShort({ id, number, loading }: props) {
  const [activeMenu, setActiveMenu] = useState<boolean>(false);
  const { token, currentUser } = useAuth();
  const formattedNumber = number ? number.toString().padStart(2, "0") : "";
  const queryClient = useQueryClient();
  const { isPlaying, songPlayId, pauseSong, playSong, start } = useAudio();
  const dispatch = useDispatch();
  const {} = useAudio();
  const menuSong = useSelector((state: RootState) => state.menuSong);
  const btnMenuRef = React.createRef<HTMLButtonElement>();

  const { data: song } = useQuery({
    queryKey: ["song", id],
    queryFn: async () => {
      const res = await songApi.getDetail(id, token);
      return res;
    },
  });

  const { data: isLike, refetch: refetchLike } = useQuery({
    queryKey: ["like-song", song?.id],
    queryFn: async () => {
      const res = song && (await songApi.checkLikedSong(song?.id ?? "", token));
      return res && res.isLiked;
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

  const handleClickPlay = (id: string) => {
    if (songPlayId === id && isPlaying) {
      pauseSong();
    } else if (songPlayId === id && !isPlaying) {
      playSong();
    } else {
      start(id);
    }
  };

  const handleClickOpenMenu = () => {
    if (menuSong?.open) {
      dispatch(closeMenu());
    } else {
      const rect = btnMenuRef.current?.getBoundingClientRect();
      rect &&
        dispatch(
          openMenu({
            open: true,
            id: song?.id ?? "",
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          })
        );
    }
  };

  return (
    <div
      className={`TrackShort ${songPlayId === song?.id ? "play" : ""} ${
        activeMenu ? "activeMenu" : ""
      } `}
    >
      <div className="TrackShort__left">
        {number && (
          <div className="TrackShort__left__num">
            <h2>{formattedNumber}</h2>
            <div className="line"></div>
          </div>
        )}
        <div className="TrackShort__left__image">
          <ImageWithFallback
            src={song?.image_path ?? ""}
            fallbackSrc={Images.SONG}
            alt=""
          />
          <button
            className={`button-play ${songPlayId === song?.id ? "active" : ""}`}
            onClick={() => handleClickPlay(song?.id ?? "")}
          >
            {isPlaying && songPlayId === song?.id ? (
              <IconPlay />
            ) : (
              <i className="fa-solid fa-play"></i>
            )}
          </button>
        </div>
        <div className="TrackShort__left__desc">
          <Link to={`${PATH.SONG}/${song?.id}`}>
            <h2>{song?.title}</h2>
          </Link>
          <span>{song?.author}</span>
        </div>
      </div>
      <div className="TrackShort__right">
        <div className="item-hover">
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
          <button
            ref={btnMenuRef}
            className={`button-edit ${
              menuSong?.open && menuSong?.id === song?.id ? " active" : ""
            }`}
            onClick={handleClickOpenMenu}
          >
            <i className="fa-solid fa-ellipsis"></i>
          </button>
        </div>
        <div className="item-listen">
          <button className={`button-like ${isLike ? "active" : ""}`}>
            <i className="fa-solid fa-heart"></i>
          </button>
          <span>
            {numeral(song?.count_listen ?? 0)
              .format("0a")
              .toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TrackShort;
