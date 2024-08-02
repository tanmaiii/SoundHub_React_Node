import { useState } from "react";
import { songApi } from "../../apis";
import { TSong } from "../../types";
import "./style.scss";

import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import TableTrack from "../../components/TableTrack";
import { useAuth } from "../../context/authContext";

export default function ArtistSongPage() {
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [songs, setSongs] = useState<TSong[] | null>(null);
  const { token } = useAuth();
  const { id } = useParams();

  const handleGetSong = async () => {
    try {
      const res = await songApi.getAllByUserId(token, id ?? "", 1, 0);
      res.data && setSongs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const { isLoading, error, data } = useQuery(["songs"], () => handleGetSong());

  return (
    <div className="discography">
      <div className="discography__container">
        <div className="discography__container__header">
          <div className="discography__container__header__left">
            <h4>Phuong Ly</h4>
          </div>
          <div className="discography__container__header__right">
            <div className="dropdown">
              <div
                className="dropdown__header"
                onClick={() => setActiveDropdown(!activeDropdown)}
              >
                <i className="fa-light fa-bars-sort"></i>
                <span>Mới nhất</span>
                <i className="fa-light fa-chevron-down"></i>
              </div>
              <div
                className={`dropdown__content ${
                  activeDropdown ? "active" : ""
                }`}
              >
                <ul>
                  <li>Mới nhất</li>
                  <li>Phổ biến</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="discography__container__body">
          <TableTrack
            songs={songs || []}
            isLoading={true}
            userId={id}
          />
        </div>
      </div>
    </div>
  );
}
