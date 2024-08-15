import React, { useEffect, useRef, useState } from "react";
import Slider from "../Slider";
import "./style.scss";

const BoxAudio = ({ file: fileMp3 }: { file: File }) => {
  const [play, setPlay] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const ValRef = useRef<HTMLInputElement>(null);
  const [urlMp3, setUrlMp3] = useState<string | null>(() =>
    fileMp3 ? URL.createObjectURL(fileMp3) : null
  );

  const [percentage, setPercentage] = useState(0);

  const [valueVolume, setValueVolume] = useState<string>("50");

  let [minutes, setMinutes] = useState<string>("00");
  let [seconds, setSeconds] = useState<string>("00");

  let [minutesPlay, setMinutesPlay] = useState<string>("00");
  let [secondsPlay, setSecondsPlay] = useState<string>("00");

  useEffect(() => {
    fileMp3 ? setUrlMp3(URL.createObjectURL(fileMp3)) : setUrlMp3(null);
  }, [fileMp3]);

  const onChangeSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      audio.currentTime = (audio.duration / 100) * parseFloat(e.target.value);
    }
    setPercentage(parseFloat(e.target.value));
  };

  const handlePlay = () => {
    if (audioRef.current?.paused) {
      setPlay(true);
      audioRef.current?.play();
    } else {
      setPlay(false);
      audioRef.current?.pause();
    }
  };

  useEffect(() => {
    const duration = audioRef.current?.duration;
    if (duration) {
      setMinutes(
        Math.floor(duration / 60)
          .toString()
          .padStart(2, "0")
      );
      setSeconds(
        Math.floor(duration % 60)
          .toString()
          .padStart(2, "0")
      );
    }
  }, [fileMp3, audioRef]);

  const onPlaying = () => {
    const duration = audioRef.current?.duration;
    const ct: number | undefined = audioRef.current?.currentTime;

    const percent =
      ct && duration ? ((ct / duration) * 100).toFixed(2) : undefined;
    percent && setPercentage(+percent);

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

    duration &&
      setMinutes(
        Math.floor(duration / 60)
          .toString()
          .padStart(2, "0")
      );
    duration &&
      setSeconds(
        Math.floor(duration % 60)
          .toString()
          .padStart(2, "0")
      );
  };

  const onEndedAuido = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Đặt thời gian phát lại về 0
      audioRef.current.play(); // Phát lại âm thanh từ đầu
    }
  };

  useEffect(() => {
    audioRef.current!.volume = parseInt(valueVolume || "0") / 100;
  }, [valueVolume]);

  return (
    <div className="box-audio">
      <audio
        ref={audioRef}
        id="audio"
        src={urlMp3 ? urlMp3 : ""}
        onTimeUpdate={onPlaying}
        onEnded={onEndedAuido}
      ></audio>

      <button className="btn-play" onClick={() => handlePlay()}>
        {play ? (
          <i className="fa-solid fa-pause"></i>
        ) : (
          <i className="fa-solid fa-play"></i>
        )}
      </button>
      <div className="box-audio__body">
        <Slider percentage={percentage} onChange={onChangeSlider} />
        <div className="time">
          <span>{`${minutesPlay}:${secondsPlay}`}</span>
          <span>{`${minutes}:${seconds}`}</span>
        </div>
      </div>
      <div className="box-audio__volume">
        <div className="volume-progress">
          <span
            className="slider-track"
            style={{ width: `${valueVolume ?? 0 * 100}%` }}
          ></span>

          <input
            type="range"
            name="volume"
            className="max-val"
            ref={ValRef}
            onInput={(e) => setValueVolume(e.currentTarget?.value)}
            max={100}
            min={0}
            value={valueVolume}
          />
        </div>
        <button
          className="btn-volume"
          onClick={() => {
            setValueVolume(valueVolume !== "0" ? "0" : "50");
          }}
        >
          {valueVolume !== "0" ? (
            <i className="fa-light fa-volume"></i>
          ) : (
            <i className="fa-light fa-volume-slash"></i>
          )}
        </button>
      </div>
    </div>
  );
};

export default BoxAudio;
