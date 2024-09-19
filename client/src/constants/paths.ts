import { lazy, FunctionComponent, Children } from "react";
import { ComponentType } from "react";
import MyPlaylistPage from "../pages/MyPlaylistPage";
import MyArtistPage from "../pages/MyArtistPage";
import Password from "../pages/SettingPage/Password/index";
import SettingPage from "../pages/SettingPage";

const HomePage: FunctionComponent<any> = lazy(
  () => import("../pages/HomePage") as Promise<{ default: ComponentType<any> }>
);
const LoginPage = lazy(() => import("../pages/AuthPages/LoginPage"));
const SignupPage = lazy(() => import("../pages/AuthPages/SignupPage"));
const ForgotPasswordPage = lazy(() => import("../pages/AuthPages/ForgotPassword"));
const ResetPasswordPage = lazy(() => import("../pages/AuthPages/ResetPassword"));
const VerifyAccoutPage = lazy(() => import("../pages/AuthPages/VerifyAccout"));
const ArtistPage = lazy(() => import("../pages/ArtistPage"));
const ArtistSongPage = lazy(() => import("../pages/ArtistSongPage"));
const ArtistPlaylistPage = lazy(() => import("../pages/ArtistPlaylistPage"));
const PlaylistPage = lazy(() => import("../pages/PlaylistPage"));
const FavouritePage = lazy(
  () => import("../pages/FavouritePage/FavouritePage")
);

const UploadPage = lazy(() => import("../pages/UploadPage"));

const RecentlyPage = lazy(() => import("../pages/RecentlyPage"));
const SongPage = lazy(() => import("../pages/SongPage"));

const VerifyPage = lazy(
  () => import("../pages/AuthPages/VerifyPage/VerifyPage")
);
const SearchPage = lazy(() => import("../pages/SearchPage"));

const NotFoundPage = lazy(() => import("../pages/ErrorPage/ErrorPage"));

const AuthLayout = lazy(() => import("../layout/AuthLayout"));

const AccountPage = lazy(() => import("../pages/SettingPage/Account"));
const PasswordPage = lazy(() => import("../pages/SettingPage/Password"));
const SettingsPage = lazy(() => import("../pages/SettingPage"));

const PATH = {
  HOME: "/",
  ARTIST: "/artist",
  FAVOURITE: "/favourite",
  ARTIST_SHOW: "/artist/:id",
  RECENTLY: "/recently",

  UPLOAD: "/upload",

  SETTINGS: "/settings",
  SETTINGS_SHOW: "/settings/:pathname",
  ACCOUNT: "/account",
  NOTIFY: "/notify",
  CHANGE_PASSWORD: "/change-password",
  CHANGE_EMAIL: "/change-email",
  DARK_MODE: "/dark-mode",
  LANGUAGES: "/languages",
  HELP: "/help",
  STATUS: "/status",

  SEARCH: "/search",
  SEARCH_SHOW: "/search/:keyword",

  ARTIST_PLAYLIST: "/playlist",
  ARTIST_PLAYLIST_SHOW: "/artist/:id/playlist",

  ARTIST_SONG: "/song",
  ARTIST_SONG_SHOW: "/artist/:id/song",

  PLAYLIST: "/playlist",
  PLAYLIST_SHOW: "/playlist/:id",
  SONG: "/song",
  SONG_SHOW: "/song/:id",

  LOGIN: "/login",
  SIGNUP: "/signup",
  RESET_PASSWORD: "/reset-password",
  FORGOT_PASSWORD: "/forgot-password",
  VERIFY_ACCOUNT: "/verify-account",

  MY_PROFILE: "/my-profile",
  MY_PLAYLIST: "/my-playlist",
  MY_ARTIST: "/my-artist",

  ERROR: "/error",
};

const publicRoutes = [
  { path: PATH.HOME, layout: null, component: HomePage },
  { path: PATH.RECENTLY, layout: null, component: RecentlyPage },
  { path: PATH.FAVOURITE, layout: null, component: FavouritePage },
  { path: PATH.UPLOAD, layout: null, component: UploadPage },

  { path: PATH.SETTINGS, layout: null, component: SettingsPage },
  { path: PATH.SETTINGS_SHOW, layout: null, component: SettingsPage },

  { path: PATH.SEARCH, layout: null, component: SearchPage },
  { path: PATH.SEARCH_SHOW, layout: null, component: SearchPage },

  //Auth
  { path: PATH.LOGIN, layout: AuthLayout, component: LoginPage },
  { path: PATH.SIGNUP, layout: AuthLayout, component: SignupPage },
  { path: PATH.FORGOT_PASSWORD, layout: AuthLayout, component: ForgotPasswordPage },
  { path: PATH.VERIFY_ACCOUNT, layout: AuthLayout, component: VerifyAccoutPage },
  { path: PATH.RESET_PASSWORD, layout: AuthLayout, component: ResetPasswordPage },

  // { path: PATH.VERIFY, layout: AuthLayout, component: VerifyPage },

  { path: PATH.ARTIST_SHOW, layout: null, component: ArtistPage },
  { path: PATH.ARTIST_SONG_SHOW, layout: null, component: ArtistSongPage },
  {
    path: PATH.ARTIST_PLAYLIST_SHOW,
    layout: null,
    component: ArtistPlaylistPage,
  },

  { path: PATH.PLAYLIST_SHOW, layout: null, component: PlaylistPage },
  { path: PATH.SONG_SHOW, layout: null, component: SongPage },

  { path: PATH.MY_PLAYLIST, layout: null, component: MyPlaylistPage },
  { path: PATH.MY_ARTIST, layout: null, component: MyArtistPage },

  { path: "*", layout: null, component: NotFoundPage },
];

const privateRoutes = [{ path: "*", component: NotFoundPage }];

export { PATH, publicRoutes, privateRoutes };
