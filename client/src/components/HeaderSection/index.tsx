import React from "react";
import "./style.scss";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

type Props = {
  title: string;
  to?: string;
  loading?: boolean;
};

export default function HeaderSection({ title, to, loading = false }: Props) {
  return (
    <div className="HeaderSection">
      <h4 className="HeaderSection__title">
        {loading ? <Skeleton width={100} height={"100%"} /> : title}
      </h4>
      <button className="HeaderSection__button">
        {loading ? (
          <Skeleton width={50} height={"100%"} />
        ) : (
          to ? (
            <>
              <Link to={`${to}`}>Tất cả</Link>
              <i className="fa-solid fa-angle-right"></i>
            </>
          ) : null
        )}
      </button>
    </div>
  );
}
