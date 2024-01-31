import React from "react";
import PropTypes from "prop-types";
import { ExampleReduxToolkit } from "../ExampleReduxToolkit/ExampleReduxToolkit";
import "./homePage.scss";
import Header from "../../components/Header/Header";
import Section from "../../components/Section/Section";

function HomePage(props: any) {
  return (
    <div className="home">
      <Header />
      <Section title={"Recommended"} />
    </div>
  );
}

HomePage.propTypes = {};

export default HomePage;
