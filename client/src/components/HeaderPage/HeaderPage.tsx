import Skeleton from "react-loading-skeleton";
import Images from "../../constants/images";
import ImageWithFallback from "../ImageWithFallback";
import "./headerPage.scss";
import moment from "moment";
import { useAuth } from "../../context/authContext";
// import numeral from "numeral";
import numeral from "numeral";
import { apiConfig } from "../../configs";
import { Link, useParams } from "react-router-dom";
import { PATH } from "../../constants/paths";
import { useEffect, useState } from "react";
import { genreApi, userApi } from "../../apis";
import { TGenre } from "../../types/genre.type";
import { TUser } from "../../types";

interface HeaderPageProps {
  avt: string;
  fbAvt: string;
  title: string;
  category: string;
  time?: string;
  listen?: number;
  like?: number;
  song?: number;
  userId?: string;
  genreId?: string;
  isPublic?: number;
  loading?: boolean;
  desc?: string;
  fnOpenEdit?: () => void;
}

export default function HeaderPage({
  avt,
  fbAvt,
  title,
  category,
  time,
  listen,
  loading = false,
  like,
  song,
  userId,
  isPublic,
  genreId,
  desc,
  fnOpenEdit,
}: HeaderPageProps) {
  const { currentUser } = useAuth();
  const { id } = useParams();
  const [genre, setGenre] = useState<TGenre | null>(null);
  const [sizeTitle, setSizeTitle] = useState<number>(60);
  const [author, setAuthor] = useState<TUser | undefined>(undefined);

  useEffect(() => {
    const getGenre = async () => {
      try {
        const res = await genreApi.getDetail(genreId || "");
        res && setGenre(res ?? null);
      } catch (error) {
        setGenre(null);
      }
    };
    genreId && getGenre();
  }, [genreId]);

  useEffect(() => {
    if (title.length > 24) {
      setSizeTitle(30);
    }
  }, [title]);

  useEffect(() => {
    const getAuthor = async () => {
      try {
        const res = userId && (await userApi.getDetail(userId));
        res && setAuthor(res ?? undefined);
      } catch (error) {
        console.log(error);
      }
    };
    getAuthor();
  }, [userId]);

  return (
    <div className="HeaderPage">
      <div className="HeaderPage__blur">
        <div className="bg-alpha"></div>
        <div
          className="blur"
          style={{ backgroundImage: `url(${apiConfig.imageURL(avt)})` }}
        ></div>
      </div>
      <div className="HeaderPage__body">
        <div className="avatar">
          {loading ? (
            <Skeleton width={"100%"} height={"100%"} />
          ) : (
            <>
              <ImageWithFallback src={avt} alt="" fallbackSrc={fbAvt} />
              {userId && currentUser?.id === userId && id && (
                <div
                  onClick={() => {
                    fnOpenEdit && fnOpenEdit();
                  }}
                  className="avatar__overlay"
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                </div>
              )}
            </>
          )}
        </div>
        <div className="info">
          <span className="info__category">
            {loading ? (
              <Skeleton count={1} />
            ) : (
              <>
                {isPublic === 0 && (
                  <i className="icon__private fa-regular fa-lock"></i>
                )}
                <p>{category}</p>
                {genre && (
                  <>
                    <i className="icon__dot fa-sharp fa-solid fa-circle"></i>
                    <p>{`${genre?.title}`}</p>
                  </>
                )}
              </>
            )}
          </span>
          <span className="info__title" style={{ fontSize: sizeTitle }}>
            {loading ? <Skeleton /> : title}
          </span>
          <span className="info__description">
            {loading ? <Skeleton /> : desc}
          </span>
          {loading ? (
            <Skeleton />
          ) : (
            <div className="info__desc">
              <div className="info__desc__author">
                {author?.image_path && (
                  <ImageWithFallback
                    src={author?.image_path}
                    alt="image.png"
                    fallbackSrc={Images.AVATAR}
                  />
                )}
                <Link to={`${PATH.ARTIST + "/" + userId}`}>{author?.name}</Link>
              </div>
              {time !== undefined && (
                <div className="info__desc__item">
                  <i className="fa-light fa-clock"></i>
                  <span>{moment(time).format("YYYY")}</span>
                </div>
              )}
              {listen !== undefined && (
                <div className="info__desc__item">
                  <i className="fa-light fa-headphones"></i>
                  <span>{numeral(listen).format("0a").toUpperCase()}</span>
                </div>
              )}
              {like !== undefined && (
                <div className="info__desc__item">
                  <i className="fa-light fa-heart"></i>
                  <span>{numeral(like).format("0a").toUpperCase()}</span>
                </div>
              )}
              {song !== undefined && (
                <div className="info__desc__item">
                  <i className="fa-thin fa-album"></i>
                  <span>{numeral(song).format("0a").toUpperCase()} songs</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
