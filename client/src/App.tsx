import React from "react";
import { Routes } from "./routes/routes";
import "./App.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "../src/assets/font-awesome-6-pro/css/all.css";
import { useSelector } from "react-redux";
import { RootState } from "./store";

import { SkeletonTheme } from "react-loading-skeleton";

function App() {
  const darkMode = useSelector((state: RootState) => state.darkMode.state);

  return (
    <div className={`theme-${darkMode ? "dark" : "light"}`}>
      <SkeletonTheme
        baseColor={darkMode ? "#252525" : "#ebebeb"}
        highlightColor={darkMode ? "#121212" : "#f5f5f5"}
        duration={2}
      >
        <Routes />
      </SkeletonTheme>
    </div>
  );
}

export default App;
