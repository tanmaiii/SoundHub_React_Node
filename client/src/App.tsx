import { useEffect } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./App.scss";
import { Routes } from "./routes/routes";

import { useSelector } from "react-redux";
import "../src/assets/font-awesome-6-pro/css/all.css";
import { RootState } from "./store";

import moment from "moment";
import "moment/locale/vi"; // Ví dụ: 'vi' là mã locale cho tiếng Việt
import { useTranslation } from "react-i18next";
import { SkeletonTheme } from "react-loading-skeleton";
import "../src/i18n/i18n";
import { Toaster, toast } from "sonner";

function App() {
  const darkMode = useSelector((state: RootState) => state.darkMode.state);

  const { i18n } = useTranslation();

  //Cập nhật ngôn ngữ cho Moment.js khi ngôn ngữ của ứng dụng thay đổi
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      moment.locale(lng); // Cập nhật ngôn ngữ của Moment.js
    };

    i18n.on("languageChanged", handleLanguageChange);

    // Đặt ngôn ngữ ban đầu cho Moment.js
    moment.locale(i18n.language);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);

  return (
    <div className={`theme-${darkMode ? "dark" : "light"}`}>
      <SkeletonTheme
        baseColor={darkMode ? "#252525" : "#ebebeb"}
        highlightColor={darkMode ? "#121212" : "#f5f5f5"}
        duration={2}
      >
        {/* <Loading /> */}
        <Routes />
        <Toaster position={"bottom-center"} />
      </SkeletonTheme>
    </div>
  );
}

export default App;
