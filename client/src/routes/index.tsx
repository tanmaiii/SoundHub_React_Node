import React, { lazy, Suspense } from "react";
import { Route, Routes as Router, BrowserRouter } from "react-router-dom";
import { PATH } from "../constants/paths";
import { Helmet, HelmetProvider } from "react-helmet-async"; // quản lý các thẻ trong <head>

import Loading from "../components/Loading/Loading";

import MainLayout from "../layout/MainLayout/MainLayout";

const HomePage = lazy(() => import("../pages/HomePage/HomePage"));
const AuthPage = lazy(() => import("../pages/AuthPage/AuthPage"));

const NotFoundPage = lazy(() => import("../pages/ErrorPage/ErrorPage"));

const helmetContext = {};

export const Routes = () => {
  return (
    <BrowserRouter>
      <HelmetProvider context={helmetContext}>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Sound Hub</title>
          <link
            rel="stylesheet"
            href="https://unicons.iconscout.com/release/v4.0.8/css/line.css"
          ></link>
        </Helmet>
        <Suspense fallback={<Loading />}>
          <Router>
            <Route path={PATH.HOME} element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path={PATH.ARTIST} element={<HomePage />} />
            </Route>

            <Route path={PATH.LOGIN} element={<AuthPage />} />

            {/* Error routes */}
            <Route path="*" element={<NotFoundPage />} />
          </Router>
        </Suspense>
      </HelmetProvider>
    </BrowserRouter>
  );
};
