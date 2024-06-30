import React, { useEffect, useRef, useState } from "react";
import "./barPlaying.scss";
import { Link } from "react-router-dom";
import {
  selectIsPlaying,
  selectSongPlayId,
  setNowPlaying,
  playSong,
  stopSong,
} from "../../slices/nowPlayingSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { TSong } from "../../types";
import { songApi } from "../../apis";
import Images from "../../constants/images";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAuth } from "../../context/authContext";
import { apiConfig } from "../../configs";
import { changeOpenWaiting } from "../../slices/waitingSlice";
import ImageWithFallback from "../ImageWithFallback";

export default function BarPlaying() {
  // const songPlayId = useSelector(selectSongPlayId);
  const { isPlaying } = useSelector((state: RootState) => state.nowPlaying);
  const { token } = useAuth();

  const songPlayId = useSelector(selectSongPlayId);
  const [song, setSong] = useState<TSong | null>(null);

  const getSong = async () => {
    try {
      const res =
        songPlayId && (await songApi.getDetail(songPlayId ?? "", token ?? ""));
      setSong(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    songPlayId && getSong();
  }, [songPlayId]);

  if (!songPlayId) return null;

  return (
    <div className="barPlaying">
      <div className="barPlaying__left ">
        {song && <CardSong song={song} />}
      </div>
      <div className="barPlaying__center ">
        {song && <ControlsBar song={song} />}
      </div>
      <div className="barPlaying__right ">
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
      const res: any = await songApi.checkLikedSong(song.id, token ?? "");
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
      if (!like) return songApi.likeSong(song.id, token ?? "");
      return songApi.unLikeSong(song.id, token ?? "");
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
    <div className="CardSong">
      <div className="CardSong__image">
        <ImageWithFallback
          src={
            song?.image_path
              ? apiConfig.imageURL(song?.image_path)
              : Images.SONG
          }
          fallbackSrc={Images.SONG}
          alt=""
        />
      </div>
      <div className="CardSong__desc">
        <span className="CardSong__desc__title">{song?.title}</span>
        <div className="CardSong__desc__info">
          <Link to={"/"}>
            <span>{song?.author}</span>
          </Link>
        </div>
      </div>
      <div className="CardSong__control">
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

const ControlsBar = ({ song }: CardSongProps) => {
  const songPlayId = useSelector(selectSongPlayId);
  const isPlaying = useSelector(selectIsPlaying);
  const dispatch = useDispatch();
  const audioRef = useRef<HTMLAudioElement>(null);
  const clickRef = useRef<HTMLDivElement>(null);
  // const [currentSong, setCurrentSong] = useState(song);
  const [progress, setProgress] = useState<number>(0);
  let [minutes, setMinutes] = useState<string>("00");
  let [seconds, setSeconds] = useState<string>("00");

  let [minutesPlay, setMinutesPlay] = useState<string>("00");
  let [secondsPlay, setSecondsPlay] = useState<string>("00");

  const handleClickPlay = () => {
    if (!isPlaying) {
      dispatch(playSong());
    } else {
      dispatch(stopSong());
    }
  };

  useEffect(() => {
    if (isPlaying) {
      console.log("phát nhạc");
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, songPlayId]);

  useEffect(() => {
    if (audioRef.current?.duration) {
      setMinutes(
        Math.floor(audioRef.current?.duration / 60)
          .toString()
          .padStart(2, "0")
      );
      setSeconds(
        Math.floor(audioRef.current?.duration % 60)
          .toString()
          .padStart(2, "0")
      );
    }
  }, [songPlayId]);

  const onPlaying = () => {
    const duration = audioRef.current?.duration;
    const ct: number | undefined = audioRef.current?.currentTime;

    ct &&
      setMinutesPlay(
        Math.floor(ct / 60)
          .toString()
          .padStart(2, "0")
      );
    ct &&
      setSecondsPlay(
        Math.floor(ct % 60)
          .toString()
          .padStart(2, "0")
      );

    ct && duration && setProgress((ct / duration) * 100);
  };

  const checkWidth = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    let width: number | undefined = clickRef.current?.clientWidth;
    const offset = e.nativeEvent?.offsetX;
    const duration = audioRef.current?.duration;

    const divprogress: number | undefined = width && (offset / width) * 100;

    // console.log(width, offset, divprogress);\

    const time = divprogress && duration && (divprogress / 100) * duration;

    // time && audioRef &&  audioRef.current?.currentTime == time;
  };

  return (
    <div className="ControlsBar">
      <audio
        ref={audioRef}
        id="audio"
        src={song && apiConfig.mp3Url(song?.song_path)}
        autoPlay
        onTimeUpdate={onPlaying}
      ></audio>

      <div className="ControlsBar__actions">
        <button className="btn-random active" data-tooltip={"Play randomly"}>
          <i className="fa-light fa-shuffle"></i>
        </button>
        <button>
          <i className="fa-solid fa-backward-step"></i>
        </button>
        <button className="btn_play" onClick={handleClickPlay}>
          {isPlaying ? (
            <i className="fa-solid fa-pause"></i>
          ) : (
            <i className="fa-solid fa-play"></i>
          )}
        </button>
        <button>
          <i className="fa-solid fa-forward-step"></i>
        </button>
        <button className="btn-replay" data-tooltip={"Replay"}>
          <i className="fa-light fa-repeat"></i>
        </button>
      </div>
      <div className="ControlsBar__bar">
        <span>{`${minutesPlay}:${secondsPlay}`}</span>
        <div className="progress">
          <div
            className="progress_wrapper"
            onClick={(e) => checkWidth(e)}
            ref={clickRef}
          >
            <div
              className="seek_bar"
              style={{ width: `${progress + "%"}` }}
            ></div>
            <div
              className="slider-handle"
              style={{ left: `${progress + "%"}` }}
            ></div>
          </div>
        </div>
        <span>{`${minutes}:${seconds}`}</span>
      </div>
    </div>
  );
};

const ControlsRight = (props: any) => {
  const dispatch = useDispatch();
  const openWatting = useSelector((state: RootState) => state.waiting.state);
  const handleOpenWaiting = () => {
    dispatch(changeOpenWaiting(!openWatting));
  };

  return (
    <div className="ControlsRight">
      <div className="ControlsRight__volume">
        <button className="btn__volume" data-tooltip={"Mute"}>
          <i className="fa-light fa-volume"></i>
          {/* <i className="fa-light fa-volume-xmark"></i> */}
        </button>
        <div className="ControlsRight__volume__progressbar"></div>
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
