import React from "react";
import { Route, Routes as Router, BrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import AuthPage from "../pages/AuthPage";

import { PATH } from "../constants/paths";

export const Routes = () => {
  return (
    <BrowserRouter>
      <Router>
        <Route index path={PATH.HOME} element={<HomePage />} />
        <Route path={PATH.LOGIN} element={<AuthPage />} />
      </Router>
    </BrowserRouter>
  );
};
