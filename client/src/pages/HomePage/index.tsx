import Section from "../../components/Section/Section";
import "./style.scss";

import SectionChartHome from "../../components/SectionChartHome/SectionChartHome";

import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { searchApi } from "../../apis";
import CardArtist from "../../components/CardArtist";
import CardPlaylist from "../../components/CardPlaylist";
import CardSong from "../../components/CardSong";
import { PATH } from "../../constants/paths";
import { useAuth } from "../../context/authContext";
import { useTranslation } from "react-i18next";

function HomePage(props: any) {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation("home");

  const { data: songPopular } = useQuery({
    queryKey: ["songs-popular"],
    queryFn: async () => {
      const res = await searchApi.getPopular(
        token ?? "",
        1,
        10,
        undefined,
        "new"
      );
      return res.data;
    },
  });

  const { data: songNew } = useQuery({
    queryKey: ["songs-new"],
    queryFn: async () => {
      const res = await searchApi.getSongs(
        token ?? "",
        1,
        10,
        undefined,
        "new"
      );
      return res.data;
    },
  });

  const { data: playlists } = useQuery({
    queryKey: ["playlists"],
    queryFn: async () => {
      const res = await searchApi.getPlaylists(
        token ?? "",
        1,
        10,
        undefined,
        "new"
      );
      console.log(res.data);

      return res.data;
    },
  });

  const { data: artists } = useQuery({
    queryKey: ["artists"],
    queryFn: async () => {
      const res = await searchApi.getArtists(
        token ?? "",
        1,
        10,
        undefined,
        "new"
      );
      return res.data;
    },
  });

  if (!token) return navigate(PATH.LOGIN);

  return (
    <div className="home">
      <Section title={t("section.Songs popular")} to={PATH.SONG}>
        {songPopular &&
          songPopular?.map((song, index) => (
            <CardSong key={index} song={song} />
          ))}
      </Section>

      <Section title={t("section.Songs new")} to={PATH.SONG}>
        {songNew &&
          songNew?.map((song, index) => <CardSong key={index} song={song} />)}
      </Section>

      <SectionChartHome title={"Top nhạc trong tuần"} />

      <Section title={t("section.Playlists popular")}>
        {playlists &&
          playlists?.map((playlist, index) => (
            <CardPlaylist key={index} playlist={playlist} />
          ))}
      </Section>

      <Section title={t("section.Artists relased")}>
        {artists &&
          artists?.map((artist) => (
            <CardArtist
              key={artist.id}
              id={artist.id}
              name={artist.name}
              image={artist.image_path}
              followers={"1"}
            />
          ))}
      </Section>
    </div>
  );
}

HomePage.propTypes = {};

export default HomePage;
