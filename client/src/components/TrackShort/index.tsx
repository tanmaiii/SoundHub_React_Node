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
import { useAuth } from "../../context/authContext";

type props = {
  song: TSong;
  number?: number;
  loading?: boolean;
};

function TrackShort({ song, number, loading }: props) {
  const [activeMenu, setActiveMenu] = useState<boolean>(false);
  const { token, currentUser } = useAuth();
  const formattedNumber = number ? number.toString().padStart(2, "0") : "";
  const queryClient = useQueryClient();

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
    <div className={`TrackShort ${activeMenu ? "activeMenu" : ""} `}>
      <div className="TrackShort__left">
        {number && (
          <div className="TrackShort__left__num">
            <h2>{formattedNumber}</h2>
            <div className="line"></div>
          </div>
        )}
        <div className="TrackShort__left__image">
          <ImageWithFallback
            src={song?.image_path}
            alt=""
            fallbackSrc={Images.SONG}
          />
          {/* <img src={song?.image_path} alt="" /> */}
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
            <SongMenu
              song={song}
              id={song?.id}
              active={activeMenu}
              onOpen={() => setActiveMenu(true)}
              onClose={() => setActiveMenu(false)}
            />
          </div>
        </div>
        <div className="item-listen">
          <button className={`button-like ${isLike ? "active" : ""}`}>
            <i className="fa-solid fa-heart"></i>
          </button>
          <span>
            {numeral(song.count_listen ?? 0)
              .format("0a")
              .toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TrackShort;
