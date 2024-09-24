import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HOME_VI from "../locales/vi/home.json";
import AUTH_VI from "../locales/vi/auth.json";
import SONG_VI from "../locales/vi/song.json";
import HEADER_VI from "../locales/vi/header.json";
import PLAYLIST_VI from "../locales/vi/playlist.json";
import SETTINGS_VI from "../locales/vi/settings.json";
import ARTIST_VI from "../locales/vi/artist.json";

import HOME_EN from "../locales/en/home.json";
import AUTH_EN from "../locales/en/auth.json";
import SONG_EN from "../locales/en/song.json";
import HEADER_EN from "../locales/en/header.json";
import PLAYLIST_EN from "../locales/en/playlist.json";
import SETTINGS_EN from "../locales/en/settings.json";
import ARTIST_EN from "../locales/en/artist.json";

export const locales: { [key: string]: string } = {
  en: "English",
  vi: "Tiếng Việt",
};

// translation catalog
export const resources = {
  en: {
    home: HOME_EN,
    auth: AUTH_EN,
    song: SONG_EN,
    header: HEADER_EN,
    playlist: PLAYLIST_EN,
    settings: SETTINGS_EN,
    artist: ARTIST_EN,
  },
  vi: {
    home: HOME_VI,
    auth: AUTH_VI,
    song: SONG_VI,
    header: HEADER_VI,
    playlist: PLAYLIST_VI,
    settings: SETTINGS_VI,
    artist: ARTIST_VI,
  },
} as const;

export const defaultNS = "home";

// initialize i18next with catalog and language to use
i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "vi",
  ns: ["home"],
  defaultNS: defaultNS,
  fallbackLng: "vi",
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
});
