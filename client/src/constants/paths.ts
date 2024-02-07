import { lazy } from "react";

const HomePage = lazy(() => import("../pages/HomePage/HomePage"));
const AuthPage = lazy(() => import("../pages/AuthPage/AuthPage"));
const ArtistPage = lazy(() => import("../pages/ArtistPage/ArtistPage"));
const DiscographyPage = lazy(() => import("../pages/DiscographyPage/DiscographyPage"));
const PlaylistPage = lazy(() => import("../pages/PlaylistPage/PlaylistPage"));
const SongPage = lazy(() => import("../pages/SongPage/SongPage"));

const NotFoundPage = lazy(() => import("../pages/ErrorPage/ErrorPage"));

const PATH = {
  HOME: "/",
  ARTIST: "/artist",
  ARTIST_SHOW: "/artist/:username",
  DISCOGRAPHY: "/discography",
  DISCOGRAPHY_SHOW: "/artist/:username/discography",
  PLAYLIST: "/playlist",
  PLAYLIST_SHOW: "/playlist/:id",
  SONG: "/song",
  SONG_SHOW: "/song/:id",
  FAVOURITE: "/favourite",

  LOGIN: "/login",
  REGISTER: "/signup",
};

const publicRoutes = [
  { path: PATH.HOME, layout: null, component: HomePage },
  { path: PATH.LOGIN, layout: null, component: AuthPage },
  { path: PATH.ARTIST_SHOW, layout: null, component: ArtistPage },
  { path: PATH.DISCOGRAPHY_SHOW, layout: null, component: DiscographyPage },
  { path: PATH.PLAYLIST_SHOW, layout: null, component: PlaylistPage },
  { path: PATH.SONG_SHOW, layout: null, component: SongPage },
  { path: "*", layout: null, component: NotFoundPage },
];

const privateRoutes = [{ path: "*", component: NotFoundPage }];

export { PATH, publicRoutes, privateRoutes };
