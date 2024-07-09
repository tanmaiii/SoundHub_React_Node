import { lazy, FunctionComponent } from "react";
import { ComponentType } from "react";
import MyPlaylistPage from "../pages/MyPlaylistPage";
import MyArtistPage from "../pages/MyArtistPage";

const HomePage: FunctionComponent<any> = lazy(() => import("../pages/HomePage") as Promise<{ default: ComponentType<any> }>);
const LoginPage = lazy(() => import("../pages/AuthPages/LoginPage"));
const SignupPage = lazy(() => import("../pages/AuthPages/SignupPage"));
const ArtistPage = lazy(() => import("../pages/ArtistPage/ArtistPage"));
const DiscographyPage = lazy(() => import("../pages/DiscographyPage/DiscographyPage"));
const PlaylistPage = lazy(() => import("../pages/PlaylistPage/PlaylistPage"));
const FavouritePage = lazy(() => import("../pages/FavouritePage/FavouritePage"));
const RecentlyPage = lazy(() => import("../pages/RecentlyPage/RecentlyPage"));
const SongPage = lazy(() => import("../pages/SongPage/SongPage"));
const VerifyPage = lazy(() => import("../pages/AuthPages/VerifyPage/VerifyPage"));
const SearchPage = lazy(() => import("../pages/SearchPage/SearchPage"));

const NotFoundPage = lazy(() => import("../pages/ErrorPage/ErrorPage"));

const AuthLayout = lazy(() => import("../layout/AuthLayout/AuthLayout"));

const PATH = {
  HOME: "/",
  ARTIST: "/artist",
  FAVOURITE: "/favourite",
  ARTIST_SHOW: "/artist/:id",
  RECENTLY: "/recently",

  SEARCH: "/search",
  SEARCH_SHOW: "/search/:keyword",

  DISCOGRAPHY: "/discography",
  DISCOGRAPHY_SHOW: "/artist/:username/discography",
  PLAYLIST: "/playlist",
  PLAYLIST_SHOW: "/playlist/:id",
  SONG: "/song",
  SONG_SHOW: "/song/:id",

  LOGIN: "/login",
  SIGNUP: "/signup",
  VERIFY: "/verify-email",

  MY_PROFILE: "/my-profile",
  MY_PLAYLIST: "/my-playlist",
  MY_ARTIST: "/my-artist",
};

const publicRoutes = [
  { path: PATH.HOME, layout: null, component: HomePage },
  { path: PATH.RECENTLY, layout: null, component: RecentlyPage },
  { path: PATH.FAVOURITE, layout: null, component: FavouritePage },

  { path: PATH.SEARCH, layout: null, component: SearchPage },

  { path: PATH.LOGIN, layout: AuthLayout, component: LoginPage },
  { path: PATH.SIGNUP, layout: AuthLayout, component: SignupPage },
  { path: PATH.VERIFY, layout: AuthLayout, component: VerifyPage },

  { path: PATH.ARTIST_SHOW, layout: null, component: ArtistPage },
  { path: PATH.DISCOGRAPHY_SHOW, layout: null, component: DiscographyPage },
  { path: PATH.PLAYLIST_SHOW, layout: null, component: PlaylistPage },
  { path: PATH.SONG_SHOW, layout: null, component: SongPage },

  { path: PATH.MY_PLAYLIST, layout: null, component: MyPlaylistPage },
  { path: PATH.MY_ARTIST, layout: null, component: MyArtistPage },
  

  { path: "*", layout: null, component: NotFoundPage },
];

const privateRoutes = [{ path: "*", component: NotFoundPage }];

export { PATH, publicRoutes, privateRoutes };
