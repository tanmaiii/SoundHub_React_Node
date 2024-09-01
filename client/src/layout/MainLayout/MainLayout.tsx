import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import "./mainLayout.scss";

import NavBar from "../../components/NavBar/NavBar";
import Header from "../../components/Header";
import BarPlaying from "../../components/BarPlaying/BarPlaying";
import Footer from "../../components/Footer";
import WattingList from "../../components/WattingList";
import { useAuth } from "../../context/AuthContext";
import { PATH } from "../../constants/paths";

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  document.title = "Sound Hub";

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) navigate(PATH.LOGIN);
    return;
  }, [currentUser]);

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
            <WattingList />
          </div>
        </div>
      </div>

      <div className="MainLayout__bottom">
        <BarPlaying />
      </div>
    </div>
  );
}
