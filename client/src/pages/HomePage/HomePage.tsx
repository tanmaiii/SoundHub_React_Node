import React from "react";
import PropTypes from "prop-types";
import { ExampleReduxToolkit } from "../ExampleReduxToolkit/ExampleReduxToolkit";
import "./homePage.scss";
import Header from "../../components/Header/Header";
import Section from "../../components/Section/Section";

import SectionChartHome from "../../components/SectionChartHome/SectionChartHome";

import BarPlaying from "../../components/BarPlaying/BarPlaying";

import Card from "../../components/Card/Card";
import img from "../../assets/images/poster2.png";
import avt from "../../assets/images/artist.jpg";
import CardArtist from "../../components/CardArtist/CardArtist";

function HomePage(props: any) {
  return (
    <div className="home">
      <Section title={"Recommended"}>
        <Card title={"Nấu ăn cho em"} artist={"Đen"} image={img} />
        <Card title={"Nấu ăn cho em"} artist={"Đen"} image={img} />
        <Card title={"Nấu ăn cho em"} artist={"Đen"} image={img} />
        <Card title={"Nấu ăn cho em"} artist={"Đen"} image={img} />
        <Card title={"Nấu ăn cho em"} artist={"Đen"} image={img} />
        <Card title={"Nấu ăn cho em"} artist={"Đen"} image={img} />
        <Card title={"Nấu ăn cho em"} artist={"Đen"} image={img} />
        <Card title={"Nấu ăn cho em"} artist={"Đen"} image={img} />
        <Card title={"Nấu ăn cho em"} artist={"Đen"} image={img} />
        <Card title={"Nấu ăn cho em"} artist={"Đen"} image={img} />
        <Card title={"Nấu ăn cho em"} artist={"Đen"} image={img} />
      </Section>

      {/* <SectionChartHome title={"Top Chart This Week"} /> */}
      {/* <BarPlaying /> */}

      {/* <Section title={"Artist hot"}>
        <CardArtist name={"Mono"} image={avt} followers={"3456K"}/>
        <CardArtist name={"Mono"} image={avt} followers={"3456K"}/>
        <CardArtist name={"Mono"} image={avt} followers={"3456K"}/>
        <CardArtist name={"Mono"} image={avt} followers={"3456K"}/>
        <CardArtist name={"Mono"} image={avt} followers={"3456K"}/>
        <CardArtist name={"Mono"} image={avt} followers={"3456K"}/>
        <CardArtist name={"Mono"} image={avt} followers={"3456K"}/>
        <CardArtist name={"Mono"} image={avt} followers={"3456K"}/>
        <CardArtist name={"Mono"} image={avt} followers={"3456K"}/>
        <CardArtist name={"Mono"} image={avt} followers={"3456K"}/>
        <CardArtist name={"Mono"} image={avt} followers={"3456K"}/>
        <CardArtist name={"Mono"} image={avt} followers={"3456K"}/>
        <CardArtist name={"Mono"} image={avt} followers={"3456K"}/>
        <CardArtist name={"Mono"} image={avt} followers={"3456K"}/>
        <CardArtist name={"Mono"} image={avt} followers={"3456K"}/>
        <CardArtist name={"Mono"} image={avt} followers={"3456K"}/>
      </Section> */}

    </div>
  );
}

HomePage.propTypes = {};

export default HomePage;
