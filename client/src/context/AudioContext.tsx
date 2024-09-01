import React, { createContext, useContext, useEffect, useState } from "react";
import { set } from "react-hook-form";
import { apiConfig } from "../configs";

interface TAudioContext {}

const AudioContext = createContext<TAudioContext | null>(null);

export function useAudio() {
  return useContext(AudioContext)!;
}

type Props = {
  children: React.ReactNode;
};

export const AudioContextProvider = ({ children }: Props) => {
  const [queue, setQueue] = useState<string[] | null>([]); // Danh sách chờ
  const [songId, setSongId] = useState<string | null>(null); // ID của bài hát đang phát
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // Trạng thái phát nhạc
  const [volume, setVolume] = useState<number>(0.5); // Âm lượng của bài hát
  const [random, setRandom] = useState<boolean>(false); // Trạng thái phát ngẫu nhiên
  const [timeSong, setTimeSong] = useState<string>("00:00"); // Thời gian của bài hát
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const start = () => {};

  const playSong = () => {};

  const pauseSong = () => {};

  const stope = () => {};

  const nextSong = () => {};

  const prevSong = () => {};

  const changeVolume = (value: number) => {
    setVolume(value);
    audioRef.current!.volume = value;
  };

  useEffect(() => {
    if (audioRef.current?.duration) {
      const minutes = Math.floor(audioRef.current.duration / 60)
        .toString()
        .padStart(2, "0");

      const seconds = Math.floor(audioRef.current.duration % 60)
        .toString()
        .padStart(2, "0");

      setTimeSong(`${minutes}:${seconds}`);
    }
  }, []);

  const contextValue = {};

  return (
    <AudioContext.Provider value={contextValue}>
      <audio
        ref={audioRef}
        autoPlay
        src={`http://localhost:8000/mp3/165d4b8c-680d-4de4-9dfc-3089a58139d3.mp3`}
      ></audio>
      {children}
    </AudioContext.Provider>
  );
};
