import React, { createContext, useContext, useEffect, useState } from "react";
import { apiConfig } from "../configs";
import { TSong } from "../types";
import { songApi } from "../apis";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { TRUE } from "sass";

interface TAudioContext {
  isPlaying: boolean;
  songPlayId: string | null;
  percentage: number;
  timeSong: string;
  timeSongPlay: string;
  volume: string;
  queue: string[] | null;
  start: (songId: string) => void;
  playSong: () => void;
  pauseSong: () => void;
  nextSong: () => void;
  prevSong: () => void;
  updateQueue: (songs: string[]) => void;
  addQueue: (songNewId: string) => void;
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
  const [volume, setVolume] = useState<string>(() => {
    const volume = localStorage.getItem("volume");
    return volume ? volume : "50";
  }); // Âm lượng của bài hát
  const [random, setRandom] = useState<boolean>(false); // Trạng thái phát ngẫu nhiên
  const [timeSong, setTimeSong] = useState<string>("00:00"); // Thời gian của bài hát
  const [timeSongPlay, setTimeSongPlay] = useState<string>("00:00"); // Thời gian của bài hát
  const [isValid, setIsValid] = useState<boolean>(true); // Trạng thái tải bài hát
  const [percentage, setPercentage] = useState(0); // Phần trăm thời gian bài hát
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const { token } = useAuth();

  // Xử lý lỗi file mp3
  useEffect(() => {
    const audioElement = audioRef.current;

    if (audioElement && song?.song_path) {
      const handleCanPlayThrough = () => {
        setIsValid(true);
        audioElement.volume = parseInt(volume) / 100;
        audioElement.play();
        setIsPlaying(true);
      };

      const handleError = () => {
        toast.error("Error when loading song");
        audioElement.pause();
        setIsPlaying(false);
        setIsValid(false);
      };

      audioElement.addEventListener("canplaythrough", handleCanPlayThrough);
      audioElement.addEventListener("error", handleError);

      // Kiểm tra trạng thái tải hiện tại
      audioElement.src = apiConfig.mp3Url(song?.song_path);
      audioElement?.load();

      // Cleanup event listeners on unmount
      return () => {
        audioElement.removeEventListener(
          "canplaythrough",
          handleCanPlayThrough
        );
        audioElement.removeEventListener("error", handleError);
      };
    }
  }, [audioRef.current, song?.song_path]);

  useEffect(() => {
    if (isValid) {
      setTimeSongPlay("00:00");
      setPercentage(100);
      setTimeSong("00:00");
    }
  }, [isValid]);

  useEffect(() => {
    if (songPlayId && !queue?.includes(songPlayId)) {
      setQueue(queue ? [...queue, songPlayId] : queue);
    }
  }, [songPlayId]);

  const start = async (songId: string) => {
    if (songId === songPlayId) return;
    try {
      setSongPlayId(songId);
      const res = await songApi.getDetail(songId, token);
      setSong(res);
    } catch (error) {}
  };

  const playSong = () => {
    try {
      if (isValid) {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } catch (error) {}
  };

  const pauseSong = () => {
    try {
      audioRef.current?.pause();
      setIsPlaying(false);
    } catch (error) {}
  };

  const stope = () => {};

  const nextSong = () => {
    const index = queue?.indexOf(songPlayId ?? "");
    if (index !== undefined && queue && index < queue.length - 1) {
      start(queue[index + 1]);
    }
  };

  const prevSong = () => {
    const index = queue?.indexOf(songPlayId ?? "");
    if (index !== undefined && queue && index > 0) {
      start(queue[index - 1]);
    }
  };

  const updateQueue = async (songs: string[]) => {
    setQueue(songs);
    songs.length > 0 && start(songs[0]);
    toast.success("Cập nhật danh sách chờ thành công");
  };

  const addQueue = (songNewId: string) => {
    if (!queue?.includes(songNewId)) {
      setQueue(queue ? [...queue, songNewId] : [songNewId]);
      toast.success("Thêm bài hát vào danh sách chờ thành công");
    } else {
      toast.success("Bài hát đã tồn tại trong danh sách chờ");
    }
  };

  const changeVolume = (value: string) => {
    setVolume(value);
    localStorage.setItem("volume", value);
    audioRef.current!.volume = parseInt(value) / 100;
  };

  const onChangeSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      audio.currentTime = (audio.duration / 100) * parseFloat(e.target.value);
    }
    setPercentage(parseFloat(e.target.value));
  };

  //Khi bài hát đang phát
  const onPlaying = () => {
    const audio = audioRef.current;
    // Lấy thời gian hiên tại của bài hát
    if (audio && audio.currentTime) {
      const minutes = Math.floor(audio.currentTime / 60)
        .toString()
        .padStart(2, "0");

      const seconds = Math.floor(audio.currentTime % 60)
        .toString()
        .padStart(2, "0");

      setTimeSongPlay(`${minutes}:${seconds}`);

      const percent = ((audio?.currentTime / audio?.duration) * 100).toFixed(2);

      setPercentage(+percent);
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
    queue,
    start,
    playSong,
    pauseSong,
    nextSong,
    prevSong,
    updateQueue,
    addQueue,
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
