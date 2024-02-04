import React from "react";
import { Outlet } from "react-router-dom";

import "./mainLayout.scss";

import NavBar from "../../components/Navbar/Navbar";
import Header from "../../components/Header/Header";

export default function MainLayout(children: any) {
  return (
    <div className="MainLayout">
      <NavBar />
      <div className="MainLayout__main">
        <div className="MainLayout__main__header">
          <Header />
        </div>
        <div className="MainLayout__main__content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
