import React, { createContext, useContext, useEffect, useState } from "react";
import { apiConfig } from "../configs";
import { TSong } from "../types";
import { songApi } from "../apis";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import playApi from "../apis/play/playApi";

interface TAudioContext {
  percentage: number;
  currentTime: number;

  isPlaying: boolean;
  songPlayId: string | null;
  timeSong: string;
  timeSongPlay: string;
  volume: string;
  queue: string[] | null;
  random: boolean;
  replay: boolean;

  start: (songId: string) => void;
  stope: () => void;
  playSong: () => void;
  pauseSong: () => void;
  nextSong: () => void;
  prevSong: () => void;

  updateQueue: (songs: string[]) => void;
  changePlaceQueue: (songs: string[]) => void;
  addQueue: (songNewId: string) => void;
  removeSongQueue: (songId: string) => void;

  changeVolume: (value: string) => void;
  changeRandom: (value: boolean) => void;
  changeReplay: (value: boolean) => void;

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
  const [loading, setLoading] = useState<boolean>(false);
  const [random, setRandom] = useState<boolean>(false); // Trạng thái phát ngẫu nhiên
  const [replay, setReplay] = useState<boolean>(false); // Trạng thái phát ngẫu nhiên
  const [timeSong, setTimeSong] = useState<string>("00:00"); // Thời gian của bài hát
  const [timeSongPlay, setTimeSongPlay] = useState<string>("00:00"); // Thời gian của bài hát
  const [isValid, setIsValid] = useState<boolean>(true); // Trạng thái tải bài hát
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [queueRandom, setQueueRandom] = useState<number[]>([]); //Danh sách bài hát random đã được phát
  const { token } = useAuth();

  const [percentage, setPercentage] = useState(0); // Phần trăm thời gian bài hát
  const [currentTime, setCurrentTime] = useState(0);

  // Lắng nghe sự kiện thay đổi thời gian của audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);

    // Hủy đăng ký sự kiện khi component unmount
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

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
    if (!isValid) {
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

  const getIndexRandom = () => {
    if (!queue) return 0;

    // Nếu tất cả các bài hát đã được phát, làm mới danh sách random
    if (queueRandom.length >= queue.length - 1) {
      let randomIndex;

      // Chọn một số ngẫu nhiên khác với vị trí hiện tại của songPlayId
      do {
        randomIndex = Math.floor(Math.random() * queue.length);
      } while (randomIndex === queue.indexOf(songPlayId ?? ""));

      setQueueRandom([randomIndex]);
      return randomIndex;
    }

    let randomIndex;

    // Lặp lại cho đến khi tìm được chỉ số ngẫu nhiên chưa xuất hiện trong queueRandom và khác songPlayId
    do {
      randomIndex = Math.floor(Math.random() * queue.length);
    } while (
      queueRandom.includes(randomIndex) ||
      randomIndex === queue.indexOf(songPlayId ?? "")
    );

    // Thêm chỉ số ngẫu nhiên hợp lệ vào queueRandom
    setQueueRandom([...queueRandom, randomIndex]);

    // Trả về chỉ số ngẫu nhiên
    return randomIndex;
  };

  useEffect(() => {}, [queue]);

  const start = async (songId: string) => {
    if (audioRef.current?.currentTime) audioRef.current.currentTime = 0;
    if (songId === songPlayId && audioRef.current?.currentTime) return;
    setLoading(true);
    try {
      // Lấy chi tiết bài hát
      setSongPlayId(songId);
      const res = await songApi.getDetail(songId, token);
      setSong(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    try {
      await playApi.playSong(songId, token);
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

  const stope = () => {
    setSongPlayId(null);
    setIsPlaying(false);
    setQueue([]);
    setQueueRandom([]);
    setReplay(false);
    setRandom(false);
    setPercentage(0);
    setTimeSong("00:00");
    setTimeSongPlay("00:00");
    audioRef.current?.pause();
  };

  const nextSong = () => {
    if (loading) return;
    if (replay) setReplay(false);
    if (random) {
      const index = getIndexRandom();
      queue && start(queue[index ?? 1]);
    } else {
      const index = queue?.indexOf(songPlayId ?? "");
      if (index !== undefined && queue && index + 1 < queue.length) {
        start(queue[index + 1]);
      } else {
        start(queue![0]);
      }
    }
  };

  const prevSong = () => {
    if (loading) return;
    if (replay) setReplay(false);
    if (random) {
      const index = getIndexRandom();
      queue && start(queue[index ?? 1]);
    } else {
      const index = queue?.indexOf(songPlayId ?? "");
      if (queue && index && index - 1 >= 0) {
        return queue && start(queue[index - 1]);
      } else {
        return queue && start(queue[queue.length - 1]);
      }
    }
  };

  const removeSongQueue = (songId: string) => {
    const newQueue = queue?.filter((item) => item !== songId);
    if (queue?.length === 1) {
      stope();
      return pauseSong();
    }
    if (songId === songPlayId) {
      nextSong();
      newQueue && setQueue(newQueue);
    } else {
      newQueue && setQueue(newQueue);
    }
  };

  const updateQueue = async (songs: string[]) => {
    setQueue(songs);
    songs.length > 0 && start(songs[0]);
    toast.success("Cập nhật danh sách chờ thành công");
  };

  const changePlaceQueue = (songs: string[]) => {
    setQueue(songs);
  };

  const addQueue = (songNewId: string) => {
    if (!queue?.includes(songNewId)) {
      setQueue(queue ? [...queue, songNewId] : [songNewId]);
      toast.success("Thêm bài hát vào danh sách chờ thành công");
      if (queue?.length === 0) {
        start(songNewId);
      }
    } else {
      toast.success("Bài hát đã tồn tại trong danh sách chờ");
    }
  };

  const changeVolume = (value: string) => {
    setVolume(value);
    localStorage.setItem("volume", value);
    audioRef.current!.volume = parseInt(value) / 100;
  };

  const changeRandom = (value: boolean) => {
    setRandom(value);
    setQueueRandom(queue && songPlayId ? [queue.indexOf(songPlayId)] : []);
  };

  const changeReplay = (value: boolean) => {
    setReplay(value);
  };

  const onChangeSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      audio.currentTime = (audio.duration / 100) * parseFloat(e.target.value);
      audio.volume = parseInt(volume) / 100;
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

    // console.log(audio?.currentTime);
  };

  const onEnd = () => {
    console.log("end");

    if (replay || queue?.length === 1) {
      start(songPlayId ?? "");
      const audio = audioRef.current;
      if (audio && audio.duration) {
        audio.currentTime = 0;
      }
    } else {
      nextSong();
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
    random,
    replay,
    currentTime,

    start,
    stope,
    playSong,
    pauseSong,
    nextSong,
    prevSong,

    updateQueue,
    changePlaceQueue,
    addQueue,
    removeSongQueue,

    changeVolume,
    changeRandom,
    changeReplay,

    onChangeSlider,
  };

  return (
    <AudioContext.Provider value={contextValue}>
      <audio
        ref={audioRef}
        id="audio"
        onEnded={onEnd}
        // src={song && apiConfig.mp3Url(song?.song_path)}
        autoPlay
        onTimeUpdate={onPlaying}
      ></audio>
      {children}
    </AudioContext.Provider>
  );
};
