import React from "react";
import NavBar from "../../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";

import "./mainLayout.scss";

export default function MainLayout(children: any) {
  return (
    <div className="MainLayout">
      <NavBar />
      <div className="MainLayout_main">
        <Outlet />
      </div>
    </div>
  );
}
