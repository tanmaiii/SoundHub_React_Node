import React from "react";
import PropTypes from "prop-types";
import { ExampleReduxToolkit } from "../ExampleReduxToolkit/ExampleReduxToolkit";
import "./homePage.scss";
import Header from "../../components/Header/Header";
import Section from "../../components/Section/Section";

import SectionChartHome from "../../components/SectionChartHome/SectionChartHome";

import BarPlaying from "../../components/BarPlaying/BarPlaying";

function HomePage(props: any) {
  return (
    <div className="home">
      <Header />
      <Section title={"Recommended"} />
      <SectionChartHome title={"Top Chart This Week"} />
      <BarPlaying />
      <Section title={"Album hot"} />

    </div>
  );
}

HomePage.propTypes = {};

export default HomePage;
