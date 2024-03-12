import React, { lazy, Suspense } from "react";
import { Route, Routes as Router, BrowserRouter } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async"; // quản lý các thẻ trong <head>

import Loading from "../components/Loading/Loading";

import MainLayout from "../layout/MainLayout/MainLayout";
import AuthLayout from "../layout/AuthLayout/AuthLayout";

import { publicRoutes } from "../constants/paths";

import HomePage from "../pages/HomePage/HomePage";

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
            {publicRoutes.map((route, index) => {
              const Layout = route?.layout || MainLayout;
              const Page = route?.component;
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                        <Page/>
                    </Layout>
                  }
                />
              );
            })}
          </Router>
        </Suspense>
      </HelmetProvider>
    </BrowserRouter>
  );
};
