import React, { useState } from "react";
import Track from "../../components/Track/Track";
import "./discographyPage.scss";
import img from "../../assets/images/artistHoa.jpg";
import Card from "../../components/Card/Card";

export default function DiscographyPage() {
  const [activeDropdown, setActiveDropdown] = useState(false)

  return (
    <div className="discography">
      <div className="discography__container">
        <div className="discography__container__header">
          <div className="discography__container__header__left">
            <h4>Phuong Ly</h4>
          </div>
          <div className="discography__container__header__right">
            <div className="dropdown">
              <div className="dropdown__header" onClick={() => setActiveDropdown(!activeDropdown)}>
                <i className="fa-light fa-bars-sort"></i>
                <span>Mới nhất</span>
                <i className="fa-light fa-chevron-down"></i>
              </div>
              <div className={`dropdown__content ${activeDropdown ? 'active' : ''}`}>
                <ul>
                  <li>Mới nhất</li>
                  <li>Phổ biến</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="discography__container__list row">
          <Card
            title={"Nấu ăn cho em"}
            artist={["Đen", "Đen"]}
            image={img}
            className="col pc-2 t-3 m-6"
          />
          <Card
            title={"Nấu ăn cho em"}
            artist={["Đen", "Đen"]}
            image={img}
            className="col pc-2 t-3 m-6"
          />
          <Card
            title={"Nấu ăn cho em"}
            artist={["Đen", "Đen"]}
            image={img}
            className="col pc-2 t-3 m-6"
          />
          <Card
            title={"Nấu ăn cho em"}
            artist={["Đen", "Đen"]}
            image={img}
            className="col pc-2 t-3 m-6"
          />
          <Card
            title={"Nấu ăn cho em"}
            artist={["Đen", "Đen"]}
            image={img}
            className="col pc-2 t-3 m-6"
          />
          <Card
            title={"Nấu ăn cho em"}
            artist={["Đen", "Đen"]}
            image={img}
            className="col pc-2 t-3 m-6"
          />
          <Card
            title={"Nấu ăn cho em"}
            artist={["Đen", "Đen"]}
            image={img}
            className="col pc-2 t-3 m-6"
          />
          <Card
            title={"Nấu ăn cho em"}
            artist={["Đen", "Đen"]}
            image={img}
            className="col pc-2 t-3 m-6"
          />
          <Card
            title={"Nấu ăn cho em"}
            artist={["Đen", "Đen"]}
            image={img}
            className="col pc-2 t-3 m-6"
          />
          <Card
            title={"Nấu ăn cho em"}
            artist={["Đen", "Đen"]}
            image={img}
            className="col pc-2 t-3 m-6"
          />
          <Card
            title={"Nấu ăn cho em"}
            artist={["Đen", "Đen"]}
            image={img}
            className="col pc-2 t-3 m-6"
          />
        </div>
      </div>
    </div>
  );
}
