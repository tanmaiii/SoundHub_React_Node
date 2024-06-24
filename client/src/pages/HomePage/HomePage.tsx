import React from "react";
import "./homePage.scss";
import Section from "../../components/Section/Section";

import SectionChartHome from "../../components/SectionChartHome/SectionChartHome";


import Card from "../../components/CardSong";
import CardArtist from "../../components/CardArtist/CardArtist";
import Images from "../../constants/images";
import { useQuery } from "react-query";
import { searchApi } from "../../apis";
import { useAuth } from "../../context/authContext";
import { apiConfig } from "../../configs";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../constants/paths";

function HomePage(props: any) {

  const {token} = useAuth();
  const navigate = useNavigate()

  const {
    data: songPopular,
    isLoading: loadingSongPopular,
    refetch: refetchSongPopular,
  } = useQuery({
    queryKey: ["songs-popular"],
    queryFn: async () => {
      console.log(apiConfig.baseUrl);
      const res = await searchApi.getPopular(token ?? '', 1, 10, undefined, "new");
      console.log("popular", res.data);
      
      return res.data;
    },
  });

if(!token) return navigate(PATH.LOGIN)

  return (
    <div className="home">
      <Section title={"Gợi ý"}>
        {songPopular && songPopular?.map((song) => (
          <Card song={song} />
        ))}
      </Section>

      <SectionChartHome title={"Top nhạc trong tuần"} />

      <Section title={"Ca sĩ phổ biến"}>
        <CardArtist name={"Mono"} image={Images.AVATAR} followers={"3456K"} />
        <CardArtist name={"Mono"} image={Images.AVATAR} followers={"3456K"} />
        <CardArtist name={"Mono"} image={Images.AVATAR} followers={"3456K"} />
        <CardArtist name={"Mono"} image={Images.AVATAR} followers={"3456K"} />
        <CardArtist name={"Mono"} image={Images.AVATAR} followers={"3456K"} />
        <CardArtist name={"Mono"} image={Images.AVATAR} followers={"3456K"} />
        <CardArtist name={"Mono"} image={Images.AVATAR} followers={"3456K"} />
        <CardArtist name={"Mono"} image={Images.AVATAR} followers={"3456K"} />
        <CardArtist name={"Mono"} image={Images.AVATAR} followers={"3456K"} />
        <CardArtist name={"Mono"} image={Images.AVATAR} followers={"3456K"} />
        <CardArtist name={"Mono"} image={Images.AVATAR} followers={"3456K"} />
        <CardArtist name={"Mono"} image={Images.AVATAR} followers={"3456K"} />
        <CardArtist name={"Mono"} image={Images.AVATAR} followers={"3456K"} />
        <CardArtist name={"Mono"} image={Images.AVATAR} followers={"3456K"} />
        <CardArtist name={"Mono"} image={Images.AVATAR} followers={"3456K"} />
        <CardArtist name={"Mono"} image={Images.AVATAR} followers={"3456K"} />
      </Section>
    </div>
  );
}

HomePage.propTypes = {};

export default HomePage;
