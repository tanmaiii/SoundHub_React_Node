import { useTranslation } from "react-i18next";
import { useAudio } from "../../context/AudioContext";
import "./style.scss";

const ControlsPlaying = () => {
  const {
    playSong,
    pauseSong,
    isPlaying,
    replay,
    nextSong,
    prevSong,
    changeRandom,
    changeReplay,
    random,
    queue,
  } = useAudio();
  const { t } = useTranslation("song");

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
        data-tooltip={`${
          random ? t("playing.TurnOffShuffle") : t("playing.TurnOnShuffle")
        }`}
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
        data-tooltip={`${
          replay ? t("playing.TurnOffRepeat") : t("playing.TurnOnRepeat")
        }`}
        onClick={() => changeReplay(!replay)}
      >
        <i className="fa-light fa-repeat"></i>
      </button>
    </div>
  );
};

export default ControlsPlaying;
