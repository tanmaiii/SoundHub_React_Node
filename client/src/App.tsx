import React from "react";
import { Routes } from "./routes";
import "./App.scss";

import "../src/assets/font-awesome-6-pro/css/all.css";

function App() {
  const darkMode = false;

  return (
    <div className={`theme-${darkMode ? "dark" : "light"}`}>
      <Routes />
    </div>
  );
}

export default App;
