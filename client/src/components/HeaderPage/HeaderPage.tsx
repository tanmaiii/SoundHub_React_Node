import React from "react";
import "./headerPage.scss";
import Skeleton from "react-loading-skeleton";

interface HeaderPageProps {
  avt: string;
  title: string;
  category: string;
  author?: string;
  avtAuthor?: string;
  time?: string;
  listen?: string;
  loading?: boolean;
  like?: string;
  song?: string;
}

export default function HeaderPage({
  avt,
  title,
  category,
  avtAuthor,
  author,
  time,
  listen,
  loading = false,
  like,
  song,
}: HeaderPageProps) {
  return (
    <div className="HeaderPage">
      <div className="HeaderPage__blur">
        <div className="bg-alpha"></div>

        <div className="blur" style={{ backgroundImage: `url(${avt})` }}></div>
      </div>
      <div className="HeaderPage__body">
        <div className="avatar">
          {loading ? <Skeleton height="100%" /> : <img src={avt} alt="" />}
        </div>
        <div className="info">
          <span className="info__category">{loading ? <Skeleton count={1} /> : category}</span>
          <h2 className="info__title">{loading ? <Skeleton /> : title}</h2>
          {loading ? (
            <Skeleton />
          ) : (
            <div className="info__desc">
              <div className="info__desc__author">
                <img src={avtAuthor} alt="" />
                <a href="">{author}</a>
              </div>
              <div className="info__desc__item">
                <i className="fa-light fa-clock"></i>
                <span>{time}</span>
              </div>
              {listen && (
                <div className="info__desc__item">
                  <i className="fa-light fa-headphones"></i>
                  <span>{listen}</span>
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
