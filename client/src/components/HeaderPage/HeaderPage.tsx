import Skeleton from "react-loading-skeleton";
import Images from "../../constants/images";
import ImageWithFallback from "../ImageWithFallback";
import "./headerPage.scss";
import moment from "moment";
import { useAuth } from "../../context/authContext";
// import numeral from "numeral";
import numeral from "numeral";
import { apiConfig } from "../../configs";
import { Link } from "react-router-dom";
import { PATH } from "../../constants/paths";

interface HeaderPageProps {
  avt: string;
  fbAvt: string;
  title: string;
  category: string;
  author?: string;
  avtAuthor?: string;
  time?: string;
  listen?: number;
  loading?: boolean;
  like?: string;
  song?: string;
  userId?: string;
}

export default function HeaderPage({
  avt,
  fbAvt,
  title,
  category,
  avtAuthor,
  author,
  time,
  listen,
  loading = false,
  like,
  song,
  userId,
}: HeaderPageProps) {
  const { currentUser } = useAuth();

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
              {userId && currentUser?.id === userId && (
                <div className="avatar__overlay">
                  <i className="fa-regular fa-pen-to-square"></i>
                  <span>Edit playlist</span>
                </div>
              )}
            </>
          )}
        </div>
        <div className="info">
          <span className="info__category">
            {loading ? <Skeleton count={1} /> : category}
          </span>
          <h2 className="info__title">{loading ? <Skeleton /> : title}</h2>
          {loading ? (
            <Skeleton />
          ) : (
            <div className="info__desc">
              <div className="info__desc__author">
                {avtAuthor && (
                  <ImageWithFallback
                    src={avtAuthor}
                    alt="image.png"
                    fallbackSrc={Images.AVATAR}
                  />
                )}
                <Link to={`${PATH.ARTIST + "/" + userId}`}>{author}</Link>
              </div>
              {time && (
                <div className="info__desc__item">
                  <i className="fa-light fa-clock"></i>
                  <span>{moment(time).format("YYYY")}</span>
                </div>
              )}
              {listen && (
                <div className="info__desc__item">
                  <i className="fa-light fa-headphones"></i>
                  <span>{numeral(listen).format("0a").toUpperCase()}</span>
                </div>
              )}
              {like && (
                <div className="info__desc__item">
                  <i className="fa-light fa-heart"></i>
                  <span>{like}</span>
                </div>
              )}
              {song && (
                <div className="info__desc__item">
                  <i className="fa-thin fa-album"></i>
                  <span>{song}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
