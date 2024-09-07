import { useAuth } from "../../context/AuthContext";
import { TSong } from "../../types/song.type";
import HeaderSection from "../HeaderSection";
import TrackShort from "../TrackShort/index";
import "./style.scss";

type props = {
  title: string;
  data: TSong[];
};

const chunkSize = 4;

const renderGroupOfSongs = (songs: TSong[]) => {
  const chunkedSongs = [];
  for (let i = 0; i < songs.length; i += chunkSize) {
    chunkedSongs.push(songs.slice(i, i + chunkSize));
  }
  return chunkedSongs;
};

export default function SectionSong({ title, data }: props) {
  const groupedSongs = data && renderGroupOfSongs(data);

  return (
    <div className="SectionSong">
      <HeaderSection title={title} />
      <div className="SectionSong__main">
        <div className="SectionSong__main__slide row">
          <div className="SectionSong__main__slide__col col pc-4 t-6 m-12">
            {groupedSongs[0] &&
              groupedSongs[0].map((item, index) => {
                return (
                  <TrackShort
                    id={item?.id ?? ""}
                    key={index}
                    number={index + 1}
                  />
                );
              })}
          </div>
          <div className="SectionSong__main__slide__col col pc-4 t-6 m-12">
            {groupedSongs[1] &&
              groupedSongs[1].map((item, index) => {
                return (
                  <TrackShort
                    id={item?.id ?? ""}
                    key={index}
                    number={index + 1 + chunkSize}
                  />
                );
              })}
          </div>
          <div className="SectionSong__main__slide__col col pc-4 t-0 m-0">
            {groupedSongs[2] &&
              groupedSongs[2].map((item, index) => {
                return (
                  <TrackShort
                    id={item?.id ?? ""}
                    key={index}
                    number={index + 1 + chunkSize * 2}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
