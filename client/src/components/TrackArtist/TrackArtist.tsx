import React from "react";
import "./trackArtist.scss";
import Skeleton from "react-loading-skeleton";

interface TrackArtistProps {
  name: string;
  userName?: string;
  avatarUrl?: string;
  className?: string;
  loading?: boolean;
}

export default function TrackArtist({
  name,
  userName,
  avatarUrl,
  className,
  loading = false,
}: TrackArtistProps) {
  return (
    <div className={`trackArtist ${className}`}>
      <div className="trackArtist__image">
        {loading ? <Skeleton height="100%" circle /> : <img src={avatarUrl} alt="" />}
      </div>
      <div className="trackArtist__desc">
        <span>{loading ? <Skeleton /> : "Artist"}</span>
        <h4>{loading ? <Skeleton /> : name}</h4>
      </div>
    </div>
  );
}
