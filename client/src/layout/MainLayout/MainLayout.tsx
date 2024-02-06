import React from "react";
import { Outlet } from "react-router-dom";

import "./mainLayout.scss";

import NavBar from "../../components/Navbar/Navbar";
import Header from "../../components/Header/Header";
import BarPlaying from "../../components/BarPlaying/BarPlaying";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
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
