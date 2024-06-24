import React from "react";
import HeaderPage from "../../components/HeaderPage/HeaderPage";
import "./playlistPage.scss";
import Images from "../../constants/images";


export default function PlaylistPage() {
  return (
    <div className="playlistPage">
      <HeaderPage
        avt={Images.AVATAR}
        title="Thằng điên"
        author="JustaTee"
        avtAuthor={Images.AVATAR}
        time="2022"
        // listen="18,714,210"
        category="Playlist"
        like="23,123"
        song="20 songs"
      />
      <div className="playlistPage__content">
        <div className="playlistPage__content__header">
          <button className="btn__play">
            <i className="fa-solid fa-play"></i>
          </button>
          <button>
            <i className="fa-light fa-heart"></i>
          </button>
          <button>
            <i className="fa-solid fa-ellipsis"></i>
          </button>
        </div>
        {/* <div className="playlistPage__content__tracklist">
          <Track
            number="1"
            dateAdd="2 housr ago"
            time="3:03"
            title="Thằng điên 1"
            image={avt}
            artist={["Phương Ly", "Phương Ly"]}
          />
          <Track
            number="2"
            dateAdd="2 housr ago"
            time="3:03"
            title="Thằng điên 1"
            image={avt}
            artist={["Phương Ly", "Phương Ly"]}
          />
          <Track
            number="12"
            dateAdd="2 housr ago"
            time="3:03"
            title="Thằng điên 1"
            image={avt}
            artist={["Phương Ly", "Phương Ly"]}
          />
          <Track
            number="434"
            dateAdd="2 housr ago"
            time="3:03"
            title="Thằng điên 1"
            image={avt}
            artist={["Phương Ly", "Phương Ly"]}
          />
          <Track
            number="5"
            dateAdd="2 housr ago"
            time="3:03"
            title="Thằng điên 1"
            image={avt}
            artist={["Phương Ly", "Phương Ly"]}
          />
          <Track
            number="6"
            dateAdd="2 housr ago"
            time="3:03"
            title="Thằng điên 1"
            image={avt}
            artist={["Phương Ly", "Phương Ly"]}
          />
          <Track
            number="7"
            dateAdd="2 housr ago"
            time="3:03"
            title="Thằng điên 1"
            image={avt}
            artist={["Phương Ly", "Phương Ly"]}
          />
        </div> */}
      </div>
    </div>
  );
}
