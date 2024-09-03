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

export default function BarPlaying() {
  // const { isPlaying } = useSelector((state: RootState) => state.nowPlaying);
  // const songPlayId = useSelector(selectSongPlayId);
  const { token } = useAuth();
  const { songPlayId, isPlaying, pauseSong, playSong } = useAudio();
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
    <div className="CardSong">
      <div className="CardSong__image">
        <ImageWithFallback
          src={song?.image_path ?? ""}
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

const ControlsBar = ({ song }: { song: TSong }) => {
  // const songPlayId = useSelector(selectSongPlayId);
  // const isPlaying = useSelector(selectIsPlaying);
  const dispatch = useDispatch();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  let [minutes, setMinutes] = useState<string>("00");
  let [seconds, setSeconds] = useState<string>("00");

  let [minutesPlay, setMinutesPlay] = useState<string>("00");
  let [secondsPlay, setSecondsPlay] = useState<string>("00");

  const {
    playSong,
    pauseSong,
    percentage,
    songPlayId,
    timeSong,
    timeSongPlay,
    isPlaying,
    onChangeSlider,
  } = useAudio();

  const handleClickPlay = () => {
    if (!isPlaying) {
      // dispatch(playSong());
      playSong();
    } else {
      // dispatch(stopSong());
      pauseSong();
    }
  };

  //Kiểm tra trạng thái phát nhạc
  // useEffect(() => {
  //   if (!isValid) return;
  //   if (isPlaying) {
  //     console.log("phát nhạc");
  //     audioRef.current?.play();
  //   } else {
  //     audioRef.current?.pause();
  //   }
  // }, [isPlaying, songPlayId]);

  // useEffect(() => {
  //   console.log({ isValid });

  //   if (isValid === false) {
  //     dispatch(stopSong());
  //     setMinutes("00");
  //     setSeconds("00");
  //     setMinutesPlay("00");
  //     setSecondsPlay("00");
  //   }
  // }, [isValid, songPlayId]);

  //Thay đổi thời gian bài hát
  // useEffect(() => {
  //   setPercentage(0);
  //   if (audioRef.current?.duration) {
  //     setMinutes(
  //       Math.floor(audioRef.current?.duration / 60)
  //         .toString()
  //         .padStart(2, "0")
  //     );
  //     setSeconds(
  //       Math.floor(audioRef.current?.duration % 60)
  //         .toString()
  //         .padStart(2, "0")
  //     );
  //   }
  // }, [songPlayId, audioRef.current?.duration]);

  //Cập nhật thời gian phát
  // const onPlaying = () => {
  //   if (audioRef.current?.currentTime) {
  //     setMinutesPlay(
  //       Math.floor(audioRef.current?.currentTime / 60)
  //         .toString()
  //         .padStart(2, "0")
  //     );
  //     setSecondsPlay(
  //       Math.floor(audioRef.current?.currentTime % 60)
  //         .toString()
  //         .padStart(2, "0")
  //     );
  //   }
  // };

  // const onChangeSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const audio = audioRef.current;
  //   if (audio && audio.duration) {
  //     audio.currentTime = (audio.duration / 100) * parseFloat(e.target.value);
  //   }
  //   setPercentage(parseFloat(e.target.value));
  // };

  //Thay đổi âm lượng
  // useEffect(() => {
  //   audioRef.current!.volume = parseInt(volume || "0") / 100;
  // }, [volume]);

  // useEffect(() => {
  //   const audioElement = audioRef.current;

  //   if (audioElement) {
  //     const handleCanPlayThrough = () => {
  //       setIsValid(true);
  //     };

  //     const handleError = () => {
  //       dispatch(stopSong());
  //       toast.error("Error when loading song");
  //       setIsValid(false);
  //     };

  //     audioElement.addEventListener("canplaythrough", handleCanPlayThrough);
  //     audioElement.addEventListener("error", handleError);

  //     // Kiểm tra trạng thái tải hiện tại
  //     audioElement.src = apiConfig.mp3Url(song?.song_path);
  //     audioElement.load();

  //     // Cleanup event listeners on unmount
  //     return () => {
  //       audioElement.removeEventListener(
  //         "canplaythrough",
  //         handleCanPlayThrough
  //       );
  //       audioElement.removeEventListener("error", handleError);
  //     };
  //   }
  // }, [song?.song_path]);

  return (
    <div className="ControlsBar">
      {/* <audio
        ref={audioRef}
        id="audio"
        // src={song && apiConfig.mp3Url(song?.song_path)}
        autoPlay
        onTimeUpdate={onPlaying}
        onError={(e) => console.log({ e })}
      ></audio> */}

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
  const handleOpenWaiting = () => {
    dispatch(changeOpenWaiting(!openWatting));
  };
  // const [volume, setVolume] = useState<number>(50);
  const { changeVolume, volume } = useAudio();

  const handleChangeVolume = (value: string) => {
    changeVolume(value);
  };

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
        <div className="volume-progress">
          <span
            className="slider-track"
            style={{ width: `${volume ?? 0 * 100}%` }}
          ></span>

          <input
            type="range"
            name="volume"
            className="max-val"
            ref={ValRef}
            onInput={(e) => handleChangeVolume(e.currentTarget.value)}
            max={100}
            min={0}
            value={volume}
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
