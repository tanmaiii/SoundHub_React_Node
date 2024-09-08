import React, { useEffect, useRef, useState } from "react";
import "./style.scss";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { changeOpenLyric } from "../../slices/lyricSlice";
import { useAudio } from "../../context/AudioContext";
import ImageWithFallback from "../ImageWithFallback";
import { TSong } from "../../types";
import { songApi } from "../../apis";
import { useAuth } from "../../context/AuthContext";
import Images from "../../constants/images";
import { apiConfig } from "../../configs";
import ControlsPlaying from "../ControlsPlaying";
import Slider from "../Slider";

const ModalLyric = () => {
  const dispatch = useDispatch();
  const openLyric = useSelector((state: RootState) => state.lyric.state);
  const { songPlayId } = useAudio();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [song, setSong] = useState<TSong>();
  const containerRef = useRef<HTMLDivElement>(null);
  const { timeSong, timeSongPlay, percentage, onChangeSlider } = useAudio();
  const { token } = useAuth();
  const [active, setActive] = useState(1);
  const [isInactive, setIsInactive] = useState(false);
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
          {active === 1 ? (
            <div className="ModalLyric__container__body__songPlay">
              <div className="ModalLyric__container__body__songPlay__image">
                <ImageWithFallback
                  src={song?.image_path ?? ""}
                  fallbackSrc={Images.SONG}
                  alt=""
                />
              </div>
              <div className="ModalLyric__container__body__songPlay__lyric">
                <ul>
                  <li className="is-over">
                    <p>And the vibe is feeling strong and what's</p>
                  </li>
                  <li className="is-over">
                    <p>Small turn to a friendship, a friendship</p>
                  </li>
                  <li className="is-over">
                    <p>Turn into a bond and that bond will never Be</p>
                  </li>
                  <li className="is-over">
                    <p> broken and the love will never get lost And when</p>
                  </li>
                  <li className="is-over">
                    <p>brotherhood come first then the line Will never be</p>
                  </li>
                  <li className="active">
                    <p> crossed established it on our own When that line had</p>
                  </li>
                  <li>
                    <p>to be drawn and that line is what</p>
                  </li>
                  <li>
                    <p>And the vibe is feeling strong and what's</p>
                  </li>
                  <li>
                    <p>Small turn to a friendship, a friendship</p>
                  </li>
                  <li>
                    <p>Turn into a bond and that bond will never Be</p>
                  </li>
                  <li>
                    <p> broken and the love will never get lost And when</p>
                  </li>
                  <li>
                    <p>brotherhood come first then the line Will never be</p>
                  </li>
                  <li>
                    <p> crossed established it on our own When that line had</p>
                  </li>
                  <li>
                    <p>to be drawn and that line is what</p>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <ModalLyricWaitingList />
          )}
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
        const res = await songApi.getDetail(songId, token ?? "");
        setSong(res);
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
