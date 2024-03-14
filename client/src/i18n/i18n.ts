import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HOME_EN from "../locales/en/home.json";
import HOME_VI from "../locales/vi/home.json";

import AUTH_EN from "../locales/en/auth.json";
import AUTH_VI from "../locales/vi/auth.json";

export const locales = {
  en: "English",
  vi: "Tiếng Việt",
} as const;

// translation catalog
export const resources = {
  en: {
    home: HOME_EN,
    auth: AUTH_EN,
  },
  vi: {
    home: HOME_VI,
    auth: AUTH_VI,
  },
} as const;

export const defaultNS = "home";

// initialize i18next with catalog and language to use
i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  ns: ["home"],
  defaultNS: defaultNS,
  fallbackLng: "vi",
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
});
