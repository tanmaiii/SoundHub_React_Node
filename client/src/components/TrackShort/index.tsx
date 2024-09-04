import { useState } from "react";
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
          <div className={`button-edit ${activeMenu ? " active" : ""}`}>
            {song && (
              <SongMenu
                song={song}
                id={song?.id ?? ""}
                active={activeMenu}
                onOpen={() => setActiveMenu(true)}
                onClose={() => setActiveMenu(false)}
              />
            )}
          </div>
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
