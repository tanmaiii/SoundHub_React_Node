import React from "react";
import "./style.scss";
import { useAudio } from "../../context/AudioContext";

const ControlsPlaying = () => {
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
    <div className="ControlsPlaying">
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
  );
};

export default ControlsPlaying;
