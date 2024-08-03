import { playlistApi, userApi } from "../../apis";
import "./style.scss";

import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import CardPlaylist from "../../components/CardPlaylist";
import HeaderSection from "../../components/HeaderSection";
import { useAuth } from "../../context/authContext";
import { useEffect, useState } from "react";
import { TUser } from "../../types/user.type";

export default function ArtistPlaylistPage() {
  const { token } = useAuth();
  const { id } = useParams();

  const [artist, setArtist] = useState<TUser>();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await userApi.getDetail(id ?? "");
        res && setArtist(res);
      } catch (error) {}
    };
    getUser();
  }, [artist]);

  const getAllData = async (newPage: number) => {
    try {
      const res = await playlistApi.getAllByUserId(id ?? "", 1, 0);
      if (res?.data) return res?.data;
    } catch (error) {
      return null;
    }
  };

  const { data: data } = useQuery({
    queryKey: ["artist-playlist"],
    queryFn: async () => {
      return await getAllData(1);
    },
  });

  return (
    <div className="artist-playlist">
      <div className="artist-playlist__container">
        <div className="artist-playlist__container__header">
          <HeaderSection title={artist?.name ?? "Playlist"} />
        </div>
        <div className="artist-playlist__container__body">
          <div className="MyPlaylistPage__container__body__list">
            {data &&
              data?.map((playlist, index) => {
                return (
                  <div key={index} className={"pc-2 t-3 m-6"}>
                    <CardPlaylist
                      id={playlist?.id}
                      title={playlist?.title}
                      image={playlist?.image_path}
                      author={playlist?.author}
                      userId={playlist?.user_id ?? ""}
                      isPublic={playlist?.public ?? 1}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
