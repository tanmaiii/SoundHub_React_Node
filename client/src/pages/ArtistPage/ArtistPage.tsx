import React from "react";
import "./artistPage.scss";

import avt from "../../assets/images/artistHoa.jpg";

export default function ArtistPage() {
  return (
    <div className="artist">
      <div className="artist__container">
        <div className="artist__container__hero">
          <div className="artist__container__hero__blur">
            <div className="bg-alpha"></div>
            <div className="blur" style={{ backgroundImage: `url(${avt})` }}></div>
          </div>
          <div className="artist__container__hero__body">
            <div className="avatar">
              <img src={avt} alt="" />
            </div>
            <div className="info">
              <div className="info__check">
                <i className="fa-duotone fa-badge-check"></i>
                <span>Verify</span>
              </div>
              <h2 className="info__name">Hòa Minzy</h2>
              <div className="info__desc">
                <span>270.314 followers</span>
                <button className="">
                  <span>Follow</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
