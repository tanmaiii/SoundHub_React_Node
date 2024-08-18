import React from "react";
import "./style.scss";
import Skeleton from "react-loading-skeleton";
import ImageWithFallback from "../ImageWithFallback";
import Images from "../../constants/images";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { userApi } from "../../apis";
import ArtistMenu from "../Menu/ArtistMenu";

interface TrackArtistProps {
  id: string;
  songId?: string;
  className: string;
  loading?: boolean;
}

export default function TrackArtist({
  id,
  songId,
  className,
  loading = false,
}: TrackArtistProps) {
  const [activeMenu, setActiveMenu] = React.useState<boolean>(false);

  const { data: user } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      try {
        const res = id && (await userApi.getDetail(id));
        return res;
      } catch (error) {
        console.log(error);
      }
    },
  });

  return user ? (
    <div className={`trackArtist  ${className}`}>
      <div className={`trackArtist__swapper `}>
        <Link className="trackArtist__swapper__link" to={`/artist/${id}`}>
          <div className="trackArtist__swapper__link__image">
            {loading ? (
              <Skeleton height="100%" circle />
            ) : (
              <ImageWithFallback
                src={user?.image_path ?? ""}
                fallbackSrc={Images.AVATAR}
                alt=""
              />
            )}
          </div>
          <div className="trackArtist__swapper__link__desc">
            <span>{loading ? <Skeleton /> : "Artist"}</span>
            <h4>{loading ? <Skeleton /> : user?.name}</h4>
          </div>
        </Link>
        <div className={`button-edit ${activeMenu ? " active" : ""}`}>
          {
            <ArtistMenu
              id={user.id}
              songId={songId}
              active={activeMenu}
              onOpen={() => setActiveMenu(true)}
              onClose={() => setActiveMenu(false)}
            />
          }
        </div>
      </div>
    </div>
  ) : null;
}
