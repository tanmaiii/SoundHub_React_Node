import { lazy } from "react";

const HomePage = lazy(() => import("../pages/HomePage/HomePage"));
const AuthPage = lazy(() => import("../pages/AuthPage/AuthPage"));
const ArtistPage = lazy(() => import("../pages/ArtistPage/ArtistPage"));

const NotFoundPage = lazy(() => import("../pages/ErrorPage/ErrorPage"));

const PATH = {
  HOME: "/",
  ARTIST: "/artist/:username",
  FAVOURITE: "/favourite",
  LOGIN: "/login",
  REGISTER: "/signup",
  CONTACT: "/contact",
  PROFILE: "/profile",
  SONG: "/SONG",
  SONG_SHOW: "/song/:id",
};

const publicRoutes = [
  { path: PATH.HOME, layout: null, component: HomePage },
  { path: PATH.LOGIN, layout: null, component: AuthPage },
  { path: PATH.ARTIST, layout: null, component: ArtistPage },
  { path: "*", layout: null, component: NotFoundPage },
];

const privateRoutes = [{ path: "*", component: NotFoundPage }];

export { PATH, publicRoutes, privateRoutes };
