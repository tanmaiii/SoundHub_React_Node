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
import IconPlay from "../IconPlay/IconPlay";
import { use } from "i18next";

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
          <div className="ModalLyric__container__header__buttons">
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
            {!isFullscreen && (
              <button onClick={() => dispatch(changeOpenLyric(false))}>
                <i className="fa-light fa-chevron-down"></i>
              </button>
            )}
          </div>
          <div className="ModalLyric__container__header__navigation">
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
  const { songPlayId, currentTime, isPlaying } = useAudio();
  const { token } = useAuth();
  const [lyrics, setLyrics] = useState<{ time: number; text: string }[]>([]);
  const itemRef = React.createRef<HTMLLIElement>();
  const listRef = React.createRef<HTMLUListElement>();
  const [active, setActive] = useState(0);

  const getSong = async () => {
    try {
      const res = songPlayId && (await songApi.getDetail(songPlayId, token));
      res && setSong(res);
    } catch (error) {
      console.log(error);
    }
  };

  const getLyric = async () => {
    console.log(song && song?.lyric_path);

    if (song && !song?.lyric_path) return;
    try {
      const res = songPlayId && (await lyricApi.getLyric(songPlayId, token));
      res && setLyrics(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    songPlayId && getSong();
  }, [songPlayId]);

  useEffect(() => {
    if (lyrics?.length < 0) return;
    lyrics?.forEach((lyric, index) => {
      if (!lyric.time) return;
      if (lyric.time <= currentTime && currentTime < lyric.time + 5) {
        setActive(index);
      }
    });
  }, [songPlayId, lyrics, currentTime]);

  useEffect(() => {
    setLyrics([]);
    songPlayId && getLyric();
    setActive(-1);
    if (listRef.current) {
      listRef.current.scrollIntoView({
        behavior: "smooth", // Cuộn mượt
        block: "start", // Cuộn tới giữa của phần tử
        inline: "start", // Cuộn tới phần tử gần nhất
      });
    }
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
      <div
        className={`ModalLyric__container__body__songPlay__image ${
          isPlaying ? "play" : ""
        }`}
      >
        <ImageWithFallback
          src={song?.image_path ?? ""}
          fallbackSrc={Images.SONG}
          alt=""
        />
      </div>
      <div className="ModalLyric__container__body__songPlay__lyric">
        {lyrics.length > 0 ? (
          <ul ref={listRef}>
            {lyrics.map((lyric, index) => (
              <li
                ref={index === active ? itemRef : null}
                key={index}
                className={`${index === active ? "active" : ""} ${
                  index < active ? "is-over" : ""
                } ${!lyric.time ? "no-time" : ""}`}
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
  const { songPlayId, currentTime } = useAudio();
  const swapperRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const itemRef = React.createRef<HTMLLIElement>();

  const onClickLeft = () => {
    if (!queue) return;
    if (active - 1 >= 0) {
      setActive(active - 1);
    }
  };
  const onClickRight = () => {
    if (!queue) return;
    if (active + 1 < queue?.length) {
      setActive(active + 1);
    }
  };

  useEffect(() => {
    const slider = document.querySelector(".slider__track");
    const screenWidth = window.innerWidth;

    if (slider) {
      (slider as HTMLElement).style.transform = `translateX(${
        -1 * (360 * active) + screenWidth / 2
      }px)`;
    }
  }, [window.innerWidth, active]);

  useEffect(() => {
    if (!queue) return;
    queue.forEach((song, index) => {
      if (song === songPlayId) {
        setActive(index);
      }
    });
  }, [songPlayId]);

  return (
    <div className="ModalLyricWaitingList">
      <div className="ModalLyricWaitingList__swapper">
        {active - 1 >= 0 && (
          <div className="button btn-left">
            <button onClick={onClickLeft}>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          </div>
        )}

        <ul className="slider__track" ref={swapperRef}>
          {queue &&
            queue.map((song, index) => (
              <li
                key={index}
                ref={index === active ? itemRef : null}
                className={`slider__item`}
              >
                <Item key={index} songId={song} active={index === active} />
              </li>
            ))}
        </ul>

        {queue && active + 1 < queue?.length && (
          <div className="button btn-right">
            <button onClick={onClickRight}>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Item = ({ songId, active }: { songId: string; active: boolean }) => {
  const { token } = useAuth();
  const [song, setSong] = useState<TSong>();
  const { songPlayId, isPlaying, start, playSong, pauseSong } = useAudio();

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

  const handleClickPlay = (id: string) => {
    if (songPlayId === id && isPlaying) {
      pauseSong();
    } else if (songPlayId === id && !isPlaying) {
      playSong();
    } else {
      start(id);
    }
  };

  return (
    <div className="item" onClick={() => handleClickPlay(songId)}>
      <div className={`image ${active ? "active" : ""}`}>
        <ImageWithFallback
          src={song?.image_path ?? ""}
          fallbackSrc={Images.SONG}
          alt=""
        />
        {songPlayId === songId && isPlaying ? (
          <div className="icon-play">
            <IconPlay />
          </div>
        ) : null}
      </div>
      <div className={`info ${active ? "active" : ""}`}>
        <h6>{song?.title}</h6>
        <p>{song?.author}</p>
      </div>
    </div>
  );
};
