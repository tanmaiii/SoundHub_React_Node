import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import "./style.scss";

import { apiConfig } from "../../configs";
import Images from "../../constants/images";
import { PATH } from "../../constants/paths";
import { ResSoPaAr } from "../../types";
import ImageWithFallback from "../ImageWithFallback";

export interface CardPlaylistProps {
  className?: string;
  loading?: boolean;
  playlist: ResSoPaAr;
}

function CardPlaylist({ className, playlist, loading = false }: CardPlaylistProps) {
  return (
    <div className={`CardPlaylist ${className}`}>
      <div className="CardPlaylist__container">
        <div className="CardPlaylist__container__image">
          {loading ? (
            <Skeleton height={200} />
          ) : (
            <Link target="_blank" to={`${PATH.PLAYLIST}/${playlist.id}`}>
              <ImageWithFallback
                src={
                  playlist.image_path
                    ? apiConfig.imageURL(playlist.image_path)
                    : Images.PLAYLIST
                }
                fallbackSrc={Images.PLAYLIST}
                alt=""
              />
            </Link>
          )}
        </div>

        <div className="CardPlaylist__container__desc">
          <Link target="_blank" to={`${PATH.SONG}/${"123123"}`}>
            <span className="CardPlaylist__container__desc__title">
              {loading ? <Skeleton /> : playlist.title}
            </span>
          </Link>
          <div className="CardPlaylist__container__desc__info">
            {loading ? (
              <Skeleton />
            ) : (
              <div className="CardPlaylist__container__desc__info__artist">
                <Link to={"/"}>{playlist.author}</Link>
                {/* {artists &&
                  Array.isArray(artists) &&
                  artists.map((artist, index) => (
                    <Link key={index} to={`${PATH.ARTIST}/${artist.id}`}>
                      {artist.name}
                    </Link>
                  ))} */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardPlaylist;
