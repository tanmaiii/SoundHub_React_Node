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
  const closeMenu = useSelector((state: RootState) => state.navbar.closeMenu);

  return (
    <div className="MainLayout">
      <NavBar />
      <div className={`MainLayout__main ${closeMenu ? "closeMenu" : ""}`}>
        <Header />
        <div className={`MainLayout__main__content ${closeMenu ? "closeMenu" : ""}`}>{children}</div>
        <BarPlaying />
      </div>
    </div>
  );
}
