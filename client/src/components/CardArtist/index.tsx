import "./style.scss";

import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { apiConfig } from "../../configs";
import Images from "../../constants/images";
import ImageWithFallback from "../ImageWithFallback";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { userApi } from "../../apis";
import numeral from "numeral";

interface CardProps {
  id: string;
  image?: string;
  name: string | undefined;
  followers: string;
  loading?: boolean;
}

export default function CardArtist({
  id,
  name,
  image,
  // followers,
  loading = false,
}: CardProps) {
  const { data: followers, isLoading: loadingFollower } = useQuery({
    queryKey: ["followers", id],
    queryFn: async () => {
      const res = await userApi.getCountFollowers(id ?? "");
      return res;
    },
  });

  return (
    <div className="CardArtist">
      <div className="CardArtist__container">
        <Link to={`/artist/${id}`}>
          <div className="CardArtist__container__image">
            {loading ? (
              <Skeleton circle height={200} />
            ) : (
              <ImageWithFallback
                src={image ?? ""}
                alt="image.png"
                fallbackSrc={Images.AVATAR}
              />
            )}
          </div>
        </Link>
        <div className="CardArtist__container__desc">
          <Link to={`/artist/${id}`}>
            <span className="CardArtist__container__desc__name">
              {loading ? <Skeleton /> : name}
            </span>
          </Link>
          <span className="CardArtist__container__desc__followers">
            {loading ? (
              <Skeleton />
            ) : (
              `${numeral(followers).format("0a").toUpperCase()} followers `
            )}
          </span>
          {/* {loading ? (
            <Skeleton />
          ) : (
            <button className="CardArtist__container__desc__button">
              <i className="fa-regular fa-user-plus"></i>
              <span>Follow</span>
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
}
