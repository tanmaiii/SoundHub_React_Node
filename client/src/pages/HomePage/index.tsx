import { useEffect, useState } from "react";
import Section from "../../components/Section";
import "./style.scss";

import SectionTopSong from "../../components/SectionSong";

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
  const [loading, setLoading] = useState(true);

  const { data: songPopular, isLoading: loadingSongPopular } = useQuery({
    queryKey: ["songs-popular"],
    queryFn: async () => {
      const res = await searchApi.getPopular(
        token ?? "",
        1,
        20,
        undefined,
        "new"
      );

      return res.data;
    },
  });

  const {
    data: songsFavorite,
    isLoading: loadingSongs,
    refetch: refetchSongs,
  } = useQuery({
    queryKey: ["favorite-songs"],
    queryFn: async () => {
      const res = await searchApi.getSongs(token, 1, 10, undefined, "count");
      return res.data;
    },
  });

  const { data: songNew, isLoading: loadingSongNew } = useQuery({
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

  const { data: playlists, isLoading: loadingPlaylist } = useQuery({
    queryKey: ["playlists"],
    queryFn: async () => {
      const res = await searchApi.getPlaylists(
        token ?? "",
        1,
        10,
        undefined,
        "new"
      );
      return res.data;
    },
  });

  const { data: artists, isLoading: loadingArtists } = useQuery({
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

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!token) {
      navigate(PATH.LOGIN);
      return;
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  });

  if (
    loading ||
    loadingSongPopular ||
    loadingSongNew ||
    loadingPlaylist ||
    loadingArtists
  ) {
    return (
      <div className="home">
        <Section title={""} loading={loading}>
          {null}
        </Section>
        <Section title={""} loading={loading}>
          {null}
        </Section>
        <Section title={""} loading={loading}>
          {null}
        </Section>
      </div>
    );
  }

  return (
    <div className="home">
      {songsFavorite && songsFavorite?.length > 0 && (
        <Section title={t("section.favoriteSongs")} to={PATH.SONG}>
          {songsFavorite?.map((song, index) => (
            <CardSong
              key={index}
              title={song.title}
              image={song.image_path}
              author={song.author}
              userId={song.user_id ?? ""}
              id={song.id}
            />
          ))}
        </Section>
      )}

      {songNew && songNew.length > 0 && (
        <Section title={t("section.newSongs")} to={PATH.SONG}>
          {songNew?.map((song, index) => (
            <CardSong
              key={index}
              title={song.title}
              image={song.image_path}
              author={song.author}
              userId={song.user_id ?? ""}
              id={song.id}
            />
          ))}
        </Section>
      )}

      <SectionTopSong
        title={t("section.bestMusicOfTheMonth")}
        data={songPopular ?? []}
      />

      {playlists && playlists.length > 0 && (
        <Section title={t("section.popularPlaylists")}>
          {playlists?.map((playlist, index) => (
            <CardPlaylist
              key={index}
              title={playlist.title}
              image={playlist.image_path}
              author={playlist.author}
              id={playlist.id}
              userId={playlist.user_id ?? ""}
              isPublic={playlist.public ?? 1}
            />
          ))}
        </Section>
      )}

      {artists && artists.length > 0 && (
        <Section title={t("section.relatedArtists")}>
          {artists?.map((artist) => (
            <CardArtist
              key={artist?.id}
              id={artist?.id}
              name={artist?.name}
              image={artist?.image_path}
            />
          ))}
        </Section>
      )}
    </div>
  );
}

HomePage.propTypes = {};

export default HomePage;
