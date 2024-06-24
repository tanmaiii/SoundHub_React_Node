import React from "react";
import { Outlet } from "react-router-dom";

import "./mainLayout.scss";

import NavBar from "../../components/NavBar/NavBar";
import Header from "../../components/Header/Header";
import BarPlaying from "../../components/BarPlaying/BarPlaying";

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  document.title = "Sound Hub";

  return (
    <div className="MainLayout">
      <NavBar />
      <div className={`MainLayout__main`}>
        <Header />
        <div className={`MainLayout__main__content`}>{children}</div>
        <BarPlaying />
      </div>
    </div>
  );
}
