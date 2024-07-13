import React from "react";
import { Outlet } from "react-router-dom";

import "./mainLayout.scss";

import NavBar from "../../components/NavBar/NavBar";
import Header from "../../components/Header/Header";
import BarPlaying from "../../components/BarPlaying/BarPlaying";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Footer from "../../components/Footer";
import WattingList from "../../components/WattingList";

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  document.title = "Sound Hub";
  const openWatting = useSelector((state: RootState) => state.waiting.state);

  return (
    <div className="MainLayout">
      <div className="MainLayout__top">
        <NavBar />
        <div className={`MainLayout__top__main`}>
          <div className="MainLayout__top__main__content">
            <Header />
            <div className={`MainLayout__top__main__content__body`}>
              {children}
            </div>
            <Footer />
          </div>
          <div className={`MainLayout__top__main__waiting`}>
            <WattingList/>
          </div>
        </div>
      </div>

      <div className="MainLayout__bottom">
        <BarPlaying />
      </div>
    </div>
  );
}
