import React, { useEffect, useRef, useState } from "react";
import "./style.scss";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { changeOpenLyric } from "../../slices/lyricSlice";
import { useAudio } from "../../context/AudioContext";
import ImageWithFallback from "../ImageWithFallback";
import { TSong } from "../../types";
import { lyricApi, songApi } from "../../apis";
import { useAuth } from "../../context/AuthContext";
import Images from "../../constants/images";
import { apiConfig } from "../../configs";
import ControlsPlaying from "../ControlsPlaying";
import Slider from "../Slider";
import { defaultNS } from "../../i18n/i18n";
import { log } from "console";
import { set } from "react-hook-form";

const ModalLyric = () => {
  const dispatch = useDispatch();
  const openLyric = useSelector((state: RootState) => state.lyric.state);
  const { songPlayId } = useAudio();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { timeSong, timeSongPlay, percentage, onChangeSlider } = useAudio();
  const { token } = useAuth();
  const [active, setActive] = useState(1);
  const [isInactive, setIsInactive] = useState(false);
  const [song, setSong] = useState<TSong>();
  let timer: NodeJS.Timeout | null = null; // Không cần lưu trong state

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

  const resetTimer = () => {
    setIsInactive(false);
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => setIsInactive(true), 5000); // 5000ms = 5 giây
  };

  useEffect(() => {
    // Lắng nghe sự kiện di chuyển chuột
    window.addEventListener("mousemove", resetTimer);

    // Thiết lập timer lần đầu
    resetTimer();

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      window.removeEventListener("mousemove", resetTimer);
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []); // Không cần `timer` trong dependency array

  const goFullScreen = () => {
    if (containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen(); // Chrome, Firefox, Safari
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        (containerRef.current as any).webkitRequestFullscreen(); // Safari
      } else if ((containerRef.current as any).msRequestFullscreen) {
        (containerRef.current as any).msRequestFullscreen(); // IE/Edge
      }
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen(); // Chrome, Firefox, Safari
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen(); // Safari
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen(); // IE/Edge
    }
  };

  // Hàm kiểm tra trạng thái toàn màn hình
  const checkFullscreenStatus = () => {
    if (
      document.fullscreenElement || // Chrome, Firefox
      (document as any).webkitFullscreenElement || // Safari
      (document as any).msFullscreenElement // IE/Edge
    ) {
      setIsFullscreen(true);
    } else {
      setIsFullscreen(false);
    }
  };

  // Lắng nghe sự kiện thay đổi trạng thái toàn màn hình
  React.useEffect(() => {
    document.addEventListener("fullscreenchange", checkFullscreenStatus);
    document.addEventListener("webkitfullscreenchange", checkFullscreenStatus);
    document.addEventListener("msfullscreenchange", checkFullscreenStatus);

    // Cleanup khi component unmount
    return () => {
      document.removeEventListener("fullscreenchange", checkFullscreenStatus);
      document.removeEventListener(
        "webkitfullscreenchange",
        checkFullscreenStatus
      );
      document.removeEventListener("msfullscreenchange", checkFullscreenStatus);
    };
  }, []);

  return (
    <div className="ModalLyric" ref={containerRef}>
      <div className={`ModalLyric__container ${isInactive ? "inactive" : ""}`}>
        <div className="ModalLyric__container__blur">
          <div
            className="image"
            style={{
              backgroundImage: `url(${apiConfig.imageURL(
                song?.image_path ?? ""
              )})`,
            }}
          ></div>
          <div className="overlay"></div>
        </div>

        <div className="ModalLyric__container__header">
          <div className="ModalLyric__container__header__left"></div>
          <div className="ModalLyric__container__header__center">
            <ul>
              <li
                onClick={() => setActive(1)}
                className={`${active === 1 ? "active" : ""}`}
              >
                <h4>Lời bài hát</h4>
              </li>
              <li
                onClick={() => setActive(2)}
                className={`${active === 2 ? "active" : ""}`}
              >
                <h4>Danh sách phát</h4>
              </li>
            </ul>
          </div>
          <div className="ModalLyric__container__header__right">
            <button
              onClick={() =>
                !isFullscreen ? goFullScreen() : exitFullScreen()
              }
            >
              {!isFullscreen ? (
                <i className="fa-sharp fa-light fa-arrow-up-right-and-arrow-down-left-from-center"></i>
              ) : (
                <i className="fa-light fa-arrow-down-left-and-arrow-up-right-to-center"></i>
              )}
            </button>
            <button>
              <i className="fa-light fa-gear"></i>
            </button>
            {!isFullscreen && (
              <button onClick={() => dispatch(changeOpenLyric(false))}>
                <i className="fa-light fa-chevron-down"></i>
              </button>
            )}
          </div>
        </div>
        <div className="ModalLyric__container__body">
          {active === 1 ? <ModalLyricSongPlay /> : <ModalLyricWaitingList />}
        </div>
        <div className="ModalLyric__container__bottom">
          <h6>
            {song?.title} - {song?.author}
          </h6>
          <div className="ModalLyric__container__bottom__bar">
            <span>{`${timeSongPlay}`}</span>
            <div className="progress">
              <Slider percentage={percentage} onChange={onChangeSlider} />
            </div>
            <span>{`${timeSong}`}</span>
          </div>
          <ControlsPlaying />
        </div>
      </div>
    </div>
  );
};

export default ModalLyric;

const ModalLyricSongPlay = () => {
  const [song, setSong] = useState<TSong>();
  const { songPlayId, currentTime } = useAudio();
  const { token } = useAuth();
  const [lyrics, setLyrics] = useState<{ time: number; text: string }[]>([]);
  const itemRef = React.createRef<HTMLLIElement>();

  const getSong = async () => {
    try {
      const res = songPlayId && (await songApi.getDetail(songPlayId, token));
      res && setSong(res);
    } catch (error) {
      console.log(error);
    }
  };

  const getLyric = async () => {
    if (song && song?.lyric_path === null) return;
    try {
      const res = songPlayId && (await lyricApi.getLyric(songPlayId, token));
      res && setLyrics(res);
    } catch (error) {}
  };

  useEffect(() => {
    songPlayId && getSong();
  }, [songPlayId]);

  useEffect(() => {
    setLyrics([]);
    songPlayId && getLyric();
  }, [song]);

  useEffect(() => {
    // Sử dụng scrollIntoView nếu itemRef hiện tại không null
    if (itemRef.current) {
      itemRef.current.scrollIntoView({
        behavior: "smooth", // Cuộn mượt
        block: "center", // Cuộn tới giữa của phần tử
        inline: "nearest", // Cuộn tới phần tử gần nhất
      });
    }
  }, [currentTime]);

  return (
    <div className="ModalLyric__container__body__songPlay">
      <div className="ModalLyric__container__body__songPlay__image">
        <ImageWithFallback
          src={song?.image_path ?? ""}
          fallbackSrc={Images.SONG}
          alt=""
        />
      </div>
      <div className="ModalLyric__container__body__songPlay__lyric">
        {lyrics.length > 0 ? (
          <ul>
            {lyrics.map((lyric, index) => (
              <li
                ref={
                  lyric.time <= currentTime && currentTime < lyric.time + 5
                    ? itemRef
                    : null
                }
                key={index}
                className={`${
                  lyric.time <= currentTime && currentTime < lyric.time + 5
                    ? "active"
                    : ""
                } ${currentTime > lyric.time + 5 ? "is-over" : ""}`}
              >
                <p>{lyric.text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-lyric">
            <p>Chúng tôi vẫn đang tìm lời cho bài hát này</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ModalLyricWaitingList = () => {
  const { queue } = useAudio();
  return (
    <div className="ModalLyricWaitingList">
      <ul>
        {queue &&
          queue.map((song, index) => <Item key={index} songId={song} />)}
      </ul>
    </div>
  );
};

const Item = ({ songId }: { songId: string }) => {
  const { token } = useAuth();
  const [song, setSong] = useState<TSong>();

  useEffect(() => {
    const getSong = async () => {
      try {
        const res = songId && (await songApi.getDetail(songId, token));
        res && setSong(res);
      } catch (error) {
        console.log(error);
      }
    };

    getSong();
  }, [songId, token]);

  return (
    <li>
      <div className="image">
        <ImageWithFallback
          src={song?.image_path ?? ""}
          fallbackSrc={Images.SONG}
          alt=""
        />
      </div>
      <div className="info">
        <h6>{song?.title}</h6>
        <p>{song?.author}</p>
      </div>
    </li>
  );
};
