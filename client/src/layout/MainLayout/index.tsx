import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./style.scss";

import { useDispatch, useSelector } from "react-redux";
import BarPlaying from "../../components/BarPlaying";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import PlaylistMenu from "../../components/Menu/PlaylistMenu";
import SongMenu from "../../components/Menu/SongMenu";
import ModalLyric from "../../components/ModalLyric";
import NavBar from "../../components/NavBar/NavBar";
import WattingList from "../../components/WattingList";
import { PATH } from "../../constants/paths";
import { useAuth } from "../../context/AuthContext";
import { closeMenu } from "../../slices/menuSongSlide";
import { RootState } from "../../store";

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  document.title = "Sound Hub";
  const bodyRef = React.createRef<HTMLDivElement>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const openWatting = useSelector((state: RootState) => state.waiting.state);
  const openLyric = useSelector((state: RootState) => state.lyric.state);
  const menuSong = useSelector((state: RootState) => state.menuSong);
  const menuPlaylist = useSelector((state: RootState) => state.menuPlaylist);
  const location = useLocation();

  useEffect(() => {
    if (!currentUser) navigate(PATH.LOGIN);
    return;
  }, [currentUser]);

  useEffect(() => {
    bodyRef.current?.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      dispatch(closeMenu());
    };

    menuSong.open && bodyRef.current?.addEventListener("scroll", handleScroll);
    return () => {
      bodyRef.current?.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <div className="MainLayout">
      <div className="MainLayout__top">
        <NavBar />
        <div className={`MainLayout__top__main`}>
          <div className="MainLayout__top__main__content" ref={bodyRef}>
            <Header />
            <div className={`MainLayout__top__main__content__body`}>
              {children}
            </div>
            <Footer />
          </div>
          <div
            className={`MainLayout__top__main__waiting ${
              openWatting ? "open" : ""
            }`}
          >
            <WattingList />
          </div>
        </div>
      </div>

      <div className="MainLayout__bottom">
        <BarPlaying />
      </div>

      <div className={`MainLayout__lyric ${openLyric ? "open" : ""}`}>
        <ModalLyric />
      </div>
      {menuSong.open && <SongMenu />}
      {menuPlaylist.open && <PlaylistMenu />}
    </div>
  );
}
