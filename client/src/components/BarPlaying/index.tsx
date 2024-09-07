import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { songApi } from "../../apis";
import { apiConfig } from "../../configs";
import Images from "../../constants/images";
import { useAuth } from "../../context/AuthContext";
import {
  playSong,
  selectIsPlaying,
  selectSongPlayId,
  stopSong,
} from "../../slices/nowPlayingSlice";
import { changeOpenWaiting } from "../../slices/waitingSlice";
import { RootState } from "../../store";
import { TSong } from "../../types";
import ImageWithFallback from "../ImageWithFallback";
import Slider from "../Slider";
import "./style.scss";
import { useAudio } from "../../context/AudioContext";
import { PATH } from "../../constants/paths";

export default function BarPlaying() {
  const { token } = useAuth();
  const dispatch = useDispatch();
  const {
    songPlayId,
    isPlaying,
    pauseSong,
    playSong,
    queue,
    nextSong,
    prevSong,
    percentage,
    onChangeSlider,
  } = useAudio();
  const [song, setSong] = useState<TSong | null>(null);

  const getSong = async () => {
    try {
      const res =
        songPlayId && (await songApi.getDetail(songPlayId ?? "", token ?? ""));
      res && setSong(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickPlay = () => {
    if (!isPlaying) {
      playSong();
    } else {
      pauseSong();
    }
  };

  const handleNextSong = () => {
    if (queue && queue?.length <= 1) return;
    nextSong();
  };

  // const handleOpenWaiting = () => {
  //   dispatch(changeOpenWaiting(true));
  // };

  useEffect(() => {
    songPlayId && getSong();
  }, [songPlayId]);

  if (!songPlayId) return null;

  return (
    <div className="barPlaying row">
      <div className="barPlaying__progress">
        <Slider percentage={percentage} onChange={onChangeSlider} />
      </div>
      <div className="col pc-0 t-0 m-12">
        <div className="barPlaying__mobile">
          <div className="barPlaying__mobile__left">
            <div className="barPlaying__mobile__left__image">
              <ImageWithFallback
                src={song?.image_path ?? ""}
                fallbackSrc={Images.SONG}
                alt=""
              />
            </div>
            <div className="barPlaying__mobile__left__desc">
              <Link
                to={`${PATH.SONG + "/" + song?.id}`}
                className="barPlaying__mobile__left__desc__title"
              >
                {song?.title}
              </Link>
              <div className="barPlaying__mobile__left__desc__info">
                <Link to={`${PATH.SONG + "/" + song?.user_id}`}>
                  <span>{song?.author}</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="barPlaying__mobile__right">
            <button className="btn_play" onClick={handleClickPlay}>
              {isPlaying ? (
                <i className="fa-solid fa-pause"></i>
              ) : (
                <i className="fa-solid fa-play"></i>
              )}
            </button>
            <button
              onClick={handleNextSong}
              className={`btn_next ${
                queue && queue.length > 1 ? "" : "disabled"
              }`}
            >
              <i className="fa-solid fa-forward-step"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="barPlaying__left col pc-3 t-3 m-0">
        {song && <CardSong song={song} />}
      </div>
      <div className="barPlaying__center col pc-6 t-6 m-0">
        {song && <ControlsBar song={song} />}
      </div>
      <div className="barPlaying__right col pc-3 t-3 m-0">
        <ControlsRight />
      </div>
    </div>
  );
}

interface CardSongProps {
  song: TSong;
}

const CardSong = ({ song }: CardSongProps) => {
  // const {songPlayId } = useSelector((state: RootState) => state.nowPlaying);
  const [like, setLike] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const checkLiked = async () => {
    try {
      const res: any = await songApi.checkLikedSong(song.id ?? "", token ?? "");
      setLike(res.isLiked);
    } catch (error) {
      console.log(error);
    }
  };

  const { isLoading, isError } = useQuery(["likePlaying", song.id], () => {
    return checkLiked();
  });

  const likeMutation = useMutation(
    async (like: boolean) => {
      if (!like) return songApi.likeSong(song.id ?? "", token ?? "");
      return songApi.unLikeSong(song.id ?? "", token ?? "");
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["likePlaying", song.id]);
        queryClient.invalidateQueries(["like", song.id]);
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

  return (
    <div className="CardSongPlaying">
      <div className="CardSongPlaying__image">
        <ImageWithFallback
          src={song?.image_path ?? ""}
          fallbackSrc={Images.SONG}
          alt=""
        />
      </div>
      <div className="CardSongPlaying__desc">
        <Link
          to={`${PATH.SONG + "/" + song?.id}`}
          className="CardSongPlaying__desc__title"
        >
          {song?.title}
        </Link>
        <div className="CardSongPlaying__desc__info">
          <Link to={`${PATH.SONG + "/" + song?.user_id}`}>
            <span>{song?.author}</span>
          </Link>
        </div>
      </div>
      <div className="CardSongPlaying__control">
        <button
          className={`button-like ${like ? "active" : ""}`}
          onClick={handleClickLike}
          data-tooltip={"Save to your library"}
        >
          {like ? (
            <i className="fa-solid fa-heart"></i>
          ) : (
            <i className="fa-light fa-heart"></i>
          )}
        </button>
      </div>
    </div>
  );
};

const ControlsBar = ({ song }: { song: TSong }) => {
  const {
    playSong,
    pauseSong,
    percentage,
    songPlayId,
    timeSong,
    timeSongPlay,
    isPlaying,
    replay,
    nextSong,
    prevSong,
    onChangeSlider,
    changeRandom,
    changeReplay,
    random,
    queue,
  } = useAudio();

  const handleClickPlay = () => {
    if (!isPlaying) {
      playSong();
    } else {
      pauseSong();
    }
  };

  const handlePrevSong = () => {
    if (queue && queue?.length <= 1) return;
    prevSong();
  };

  const handleNextSong = () => {
    if (queue && queue?.length <= 1) return;
    nextSong();
  };

  return (
    <div className="ControlsBar">
      <div className="ControlsBar__actions">
        <button
          className={`btn-random ${random ? "active" : ""}`}
          onClick={() => changeRandom(!random)}
          data-tooltip={`${random ? "Tắc trộn bài" : "Bật trộn bài"}`}
        >
          <i className="fa-light fa-shuffle"></i>
        </button>
        <button
          className={`btn_prev ${queue && queue.length > 1 ? "" : "disabled"}`}
          onClick={() => handlePrevSong()}
        >
          <i className="fa-solid fa-backward-step"></i>
        </button>
        <button className="btn_play" onClick={handleClickPlay}>
          {isPlaying ? (
            <i className="fa-solid fa-pause"></i>
          ) : (
            <i className="fa-solid fa-play"></i>
          )}
        </button>
        <button
          className={`btn_next ${queue && queue.length > 1 ? "" : "disabled"}`}
          onClick={() => handleNextSong()}
        >
          <i className="fa-solid fa-forward-step"></i>
        </button>
        <button
          className={`btn-replay ${replay ? "active" : ""}`}
          data-tooltip={`${replay ? "Tắc Replay" : "Bật Replay"}`}
          onClick={() => changeReplay(!replay)}
        >
          <i className="fa-light fa-repeat"></i>
        </button>
      </div>

      <div className="ControlsBar__bar">
        <span>{`${timeSongPlay}`}</span>
        <div className="progress">
          <Slider percentage={percentage} onChange={onChangeSlider} />
        </div>
        <span>{`${timeSong}`}</span>
      </div>
    </div>
  );
};

const ControlsRight = ({}: {}) => {
  const dispatch = useDispatch();
  const ValRef = useRef<HTMLInputElement>(null);
  const openWatting = useSelector((state: RootState) => state.waiting.state);
  const thumbRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [position, setPosition] = useState(50);
  const [percentage, setPercentage] = useState(50);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const [marginLeft, setMarginLeft] = useState(0);

  useEffect(() => {
    const rangeWidth = rangeRef.current?.getBoundingClientRect().width ?? 0;
    const thumbWidth = thumbRef.current?.getBoundingClientRect().width ?? 0;
    const centerThumb = (thumbWidth / 100) * percentage * -1;
    let centerProgressBar =
      thumbWidth +
      (rangeWidth / 100) * percentage -
      (thumbWidth / 100) * percentage;

    if (percentage === 0) {
      centerProgressBar = 0;
    }

    setPosition(percentage);
    setMarginLeft(centerThumb);
    setProgressBarWidth(centerProgressBar);
  }, [percentage]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChangeVolume(e.target.value);
    setPercentage(parseFloat(e.target.value));
  };

  const handleOpenWaiting = () => {
    dispatch(changeOpenWaiting(!openWatting));
  };

  // const [volume, setVolume] = useState<number>(50);
  const { changeVolume, volume } = useAudio();

  const handleChangeVolume = (value: string) => {
    changeVolume(value);
  };

  useEffect(() => {
    setPercentage(volume ? parseFloat(volume) : 50);
  }, [volume]);

  return (
    <div className="ControlsRight">
      <div className="ControlsRight__volume">
        <button
          className="btn__volume"
          data-tooltip={"Mute"}
          onClick={() => {
            handleChangeVolume(volume !== "0" ? "0" : "50");
          }}
        >
          {volume !== "0" ? (
            <i className="fa-light fa-volume"></i>
          ) : (
            <i className="fa-light fa-volume-slash"></i>
          )}
        </button>

        <div className="ControlsRight__volume__slider">
          <div
            className="ControlsRight__volume__slider__progress"
            style={{ width: `${progressBarWidth}px` }}
          ></div>
          <div
            className={`ControlsRight__volume__slider__thumb ${
              isMouseDown ? "active" : ""
            }`}
            ref={thumbRef}
            style={{ left: `${position}%`, marginLeft: `${marginLeft}px` }}
          ></div>
          <input
            type="range"
            value={position}
            ref={rangeRef}
            step="0.01"
            className="ControlsRight__volume__slider__range"
            onMouseDown={() => setIsMouseDown(true)}
            onMouseUp={() => setIsMouseDown(false)}
            onChange={onChange}
          />
        </div>
      </div>
      <button
        onClick={handleOpenWaiting}
        className={`ControlsRight__list ${openWatting ? "active" : ""}`}
        data-tooltip={"Playlist"}
      >
        <i className="fa-duotone fa-list"></i>
      </button>
    </div>
  );
};
