import "./artistPage.scss";

import Track from "../../components/Track";
import Images from "../../constants/images";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { playlistApi, searchApi, songApi, userApi } from "../../apis";
import ImageWithFallback from "../../components/ImageWithFallback";
import { apiConfig } from "../../configs";
import { useEffect } from "react";
import { useAuth } from "../../context/authContext";
import numeral from "numeral";
import Section from "../../components/Section";
import { useTranslation } from "react-i18next";
import CardPlaylist from "../../components/CardPlaylist";
import { TSong } from "../../types";
import HeaderSection from "../../components/HeaderSection";
import CardArtist from "../../components/CardArtist";
import { PATH } from "../../constants/paths";

export default function ArtistPage() {
  const { id } = useParams();
  const { currentUser, token } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation("home");

  const { data: user, isLoading } = useQuery({
    queryKey: ["artist", id],
    queryFn: async () => {
      try {
        const res = await userApi.getDetail(id ?? "");
        return res;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  });

  const { data: follow, isLoading: loadingFollow } = useQuery({
    queryKey: ["follow", id],
    queryFn: async () => {
      const res = await userApi.checkFollowing(id ?? "", token);
      return res.isFollowing;
    },
  });

  const { data: followers, isLoading: loadingFollower } = useQuery({
    queryKey: ["followers", id],
    queryFn: async () => {
      const res = await userApi.getCountFollowers(id ?? "");
      return res;
    },
  });

  const mutationFollow = useMutation({
    mutationFn: async (follow: boolean) => {
      try {
        if (follow) return await userApi.unFollow(id ?? "", token);
        return await userApi.follow(id ?? "", token);
      } catch (err: any) {
        console.log(err.response.data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["follow", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["following"],
      });
      queryClient.invalidateQueries({
        queryKey: ["all-favorites"],
      });
      queryClient.invalidateQueries({
        queryKey: ["followers", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["artists-follow"],
      });
    },
  });

  const { data: playlists, isLoading: loadingPlaylists } = useQuery({
    queryKey: ["playlists-artist", id],
    queryFn: async () => {
      const res = await playlistApi.getAllByUserId(id ?? "", 1, 10);
      return res.data;
    },
  });

  const {
    data: songs,
    isLoading: loadingSongs,
    refetch: refechSongs,
  } = useQuery({
    queryKey: ["songs-artist", id],
    queryFn: async () => {
      const res = await songApi.getAllByUserId(token, id ?? "", 1, 6);
      return res.data;
    },
  });

  const { data: artists, isLoading: loadingArtists } = useQuery({
    queryKey: ["artists"],
    queryFn: async () => {
      const res = await userApi.getAll(1, 10);
      return res.data;
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  return (
    <div className="artist">
      <div className="artist__container">
        <div className="artist__container__hero">
          <div className="artist__container__hero__blur">
            <div className="bg-alpha"></div>
            <div
              className="blur"
              style={{
                backgroundImage: `url(${apiConfig.imageURL(
                  user?.image_path ?? ""
                )})`,
              }}
            ></div>
          </div>
          <div className="artist__container__hero__body">
            <div className="avatar">
              <ImageWithFallback
                src={user?.image_path ?? ""}
                fallbackSrc={Images.AVATAR}
                alt=""
              />
              {currentUser?.id === user?.id && (
                <div className="avatar__overlay">
                  <i className="fa-regular fa-pen-to-square"></i>
                  <span>Edit playlist</span>
                </div>
              )}
            </div>
            <div className="info">
              <div className="info__check">
                <i className="fa-duotone fa-badge-check"></i>
                <span>Verify</span>
              </div>
              <h2 className="info__name">{user?.name}</h2>
              <div className="info__desc">
                <span>
                  {numeral(followers).format("0a").toUpperCase()} followers
                </span>
                {currentUser?.id !== user?.id && (
                  <button
                    className=""
                    onClick={() => mutationFollow.mutate(follow ?? false)}
                  >
                    <span>{follow ? "Following" : "Follow"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="artist__container__content">
          <div className="artist__container__content__header">
            <button className="btn__play">
              <i className="fa-solid fa-play"></i>
            </button>

            <button>
              <i className="fa-solid fa-ellipsis"></i>
            </button>
          </div>
          <div className="artist__container__content__top__section row">
            {songs && songs?.length > 0 && (
              <>
                <HeaderSection
                  title="Popular"
                  to={`${PATH.ARTIST}/${user?.id}${PATH.ARTIST_SONG}`}
                />
                <div>
                  {songs?.map((song: TSong, index: number) => (
                    <Track song={song} key={index} />
                  ))}
                </div>
              </>
            )}
          </div>
          <div>
            {playlists && playlists.length > 0 && (
              <Section
                title={"Playlist"}
                to={`${PATH.ARTIST}/${user?.id}${PATH.ARTIST_PLAYLIST}`}
              >
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
          </div>

          <div>
            {playlists && playlists.length > 0 && (
              <Section title={"Artists"}>
                {artists?.map((artist, index) => {
                  if (artist.id === id) return;
                  if (artist.id === currentUser?.id) return;

                  return (
                    <CardArtist
                      key={index}
                      image={artist.image_path}
                      name={artist.name}
                      id={artist.id}
                    />
                  );
                })}
              </Section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
