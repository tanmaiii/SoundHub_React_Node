import React from "react";
import "./trackArtist.scss";
import Skeleton from "react-loading-skeleton";
import ImageWithFallback from "../ImageWithFallback";
import Images from "../../constants/images";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { userApi } from "../../apis";
import { apiConfig } from "../../configs";

interface TrackArtistProps {
  id: string;
  className: string;
  loading?: boolean;
}

export default function TrackArtist({
  id,
  className,
  loading = false,
}: TrackArtistProps) {
  const { data: user } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      try {
        const res = await userApi.getDetail(id);
        console.log(res);
        return res;
      } catch (error) {
        return null;
      }
    },
  });

  return (
    <Link to={`/artist/${id}`} className={`trackArtist ${className}`}>
      <div className="trackArtist__image">
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
      <div className="trackArtist__desc">
        <span>{loading ? <Skeleton /> : "Artist"}</span>
        <h4>{loading ? <Skeleton /> : user?.name}</h4>
      </div>
    </Link>
  );
}
