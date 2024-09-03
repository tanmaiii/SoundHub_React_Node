import React, { createContext, useContext, useEffect, useState } from "react";
import { apiConfig } from "../configs";
import { TSong } from "../types";
import { songApi } from "../apis";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface TAudioContext {
  isPlaying: boolean;
  songPlayId: string | null;
  percentage: number;
  timeSong: string;
  timeSongPlay: string;
  volume: string;
  start: (songId: string) => void;
  playSong: () => void;
  pauseSong: () => void;
  changeVolume: (value: string) => void;
  onChangeSlider: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AudioContext = createContext<TAudioContext | null>(null);

export function useAudio() {
  return useContext(AudioContext)!;
}

type Props = {
  children: React.ReactNode;
};

export const AudioContextProvider = ({ children }: Props) => {
  const [song, setSong] = useState<TSong>(); // Bài hát đang phát
  const [queue, setQueue] = useState<string[] | null>([]); // Danh sách chờ
  const [songPlayId, setSongPlayId] = useState<string | null>(null); // ID của bài hát đang phát
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // Trạng thái phát nhạc
  const [volume, setVolume] = useState<string>("50"); // Âm lượng của bài hát
  const [random, setRandom] = useState<boolean>(false); // Trạng thái phát ngẫu nhiên
  const [timeSong, setTimeSong] = useState<string>("00:00"); // Thời gian của bài hát
  const [timeSongPlay, setTimeSongPlay] = useState<string>("00:00"); // Thời gian của bài hát
  const [isValid, setIsValid] = useState<boolean>(true); // Trạng thái tải bài hát
  const [percentage, setPercentage] = useState(0); // Phần trăm thời gian bài hát
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const { token } = useAuth();

  // Xử lý lỗi file mp3
  // useEffect(() => {
  //   const audioElement = audioRef.current;

  //   if (audioElement) {
  //     const handleCanPlayThrough = () => {
  //       setIsValid(true);
  //     };

  //     const handleError = () => {
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

  const start = async (songId: string) => {
    console.log("start", songId);
    try {
      setSongPlayId(songId);
      const audioElement = audioRef.current;

      const res = await songApi.getDetail(songId, token);
      setSong(res);

      if (audioElement && res) {
        audioElement.src = apiConfig.mp3Url(res.song_path);
        audioElement.play();
      }
    } catch (error) {}
  };

  const playSong = () => {
    try {
      audioRef.current?.play();
      setIsPlaying(true);
    } catch (error) {}
  };

  const pauseSong = () => {
    try {
      audioRef.current?.pause();
      setIsPlaying(false);
    } catch (error) {}
  };

  const stope = () => {};

  const nextSong = () => {};

  const prevSong = () => {};

  const changeVolume = (value: string) => {
    setVolume(value);
    audioRef.current!.volume = parseInt(value) / 100;
  };

  const onChangeSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      audio.currentTime = (audio.duration / 100) * parseFloat(e.target.value);
    }
    setPercentage(parseFloat(e.target.value));
  };

  // Lấy thời gian hiên tại của bài hát
  const onPlaying = () => {
    const audio = audioRef.current;

    if (audio && audio.currentTime) {
      const minutes = Math.floor(audio.currentTime / 60)
        .toString()
        .padStart(2, "0");

      const seconds = Math.floor(audio.currentTime % 60)
        .toString()
        .padStart(2, "0");

      setTimeSongPlay(`${minutes}:${seconds}`);
    }
  };

  // Lấy thời gian bài hát
  useEffect(() => {
    const audio = audioRef.current;
    if (audio?.duration) {
      const minutes = Math.floor(audio.duration / 60)
        .toString()
        .padStart(2, "0");

      const seconds = Math.floor(audio.duration % 60)
        .toString()
        .padStart(2, "0");

      setTimeSong(`${minutes}:${seconds}`);
    }
  }, [audioRef.current?.duration]);

  const contextValue: TAudioContext = {
    isPlaying,
    songPlayId,
    percentage,
    timeSong,
    timeSongPlay,
    volume,
    start,
    playSong,
    pauseSong,
    changeVolume,
    onChangeSlider,
  };

  return (
    <AudioContext.Provider value={contextValue}>
      <audio
        ref={audioRef}
        id="audio"
        // src={song && apiConfig.mp3Url(song?.song_path)}
        autoPlay
        onTimeUpdate={onPlaying}
        onError={(e) => console.log({ e })}
      ></audio>
      {children}
    </AudioContext.Provider>
  );
};
