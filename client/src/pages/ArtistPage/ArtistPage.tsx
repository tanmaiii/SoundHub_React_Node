import "./artistPage.scss";


import Track from "../../components/Track/Track";
import Images from "../../constants/images";

export default function ArtistPage() {
  return (
    <div className="artist">
      <div className="artist__container">
        <div className="artist__container__hero">
          <div className="artist__container__hero__blur">
            <div className="bg-alpha"></div>
            <div className="blur" style={{ backgroundImage: `url(${Images.AVATAR})` }}></div>
          </div>
          <div className="artist__container__hero__body">
            <div className="avatar">
              <img src={Images.AVATAR} alt="" />
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
        <div className="artist__container__content">
          <div className="contentSpacing">
            <div className="artist__container__content__top__section row">
              <div className="top__section__new col pc-4 t-12 m-12">
                <h4>New release</h4>
                <div className="top__section__new__list row">
                  <div className="col pc-12 t-12 m-12">
                    {/* <Track time="3:03" title="Thằng điên 1" /> */}
                    {/* <Track time="3:03" title="Thằng điên 2" quantity={"12,330,000"} /> */}
                  </div>
                </div>
              </div>
              <div className="top__section__popular col pc-8 t-12 m-12">
                <h4>Popular</h4>
                <div className="top__section__popular__list row">
                  <div className="col pc-6 t-6 m-12">
                    {/* <Track time="3:03" title="Thằng điên" quantity={"12,330,000"} /> */}
                    {/* <Track time="3:03" title="Thằng điên" quantity={"12,330,000"} /> */}
                    {/* <Track time="3:03" title="Thằng điên" quantity={"12,330,000"} /> */}
                  </div>
                  <div className="col pc-6 t-6 m-12">
                    {/* <Track time="3:03" title="Thằng điên" quantity={"12,330,000"} /> */}
                    {/* <Track time="3:03" title="Thằng điên" quantity={"12,330,000"} /> */}
                    {/* <Track time="3:03" title="Thằng điên" quantity={"12,330,000"} /> */}
                  </div>
                </div>
              </div>
            </div>

            {/* <Section title={"Singles"} to={`${PATH.ARTIST + "/phuong-ly" + PATH.DISCOGRAPHY}`}>
              <Card id={1} title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
              <Card id={1} title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
              <Card id={1} title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
              <Card id={1} title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
              <Card id={1} title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
              <Card id={1} title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
              <Card id={1} title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
              <Card id={1} title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
              <Card id={1} title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
              <Card id={1} title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
              <Card id={1} title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
            </Section>

            <Section title={`Featuring ${"Phương Ly"}`}>
              <Card id={1} title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
              <Card id={1} title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
              <Card id={1} title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
              <Card id={1} title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
              <Card id={1} title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
              <Card id={1} title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
              <Card id={1} title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
              <Card id={1} title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
              <Card id={1} title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
              <Card id={1} title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
              <Card id={1} title={"Nấu ăn cho em"} artist={["Đen", "Đen"]} image={img} />
            </Section> */}

            {/* <Section title={"Fans also like"}>
              <CardArtist name={"Mono"} followers={"3456K"} />
              <CardArtist name={"Mono"} followers={"3456K"} />
              <CardArtist name={"Mono"} followers={"3456K"} />
              <CardArtist name={"Mono"} followers={"3456K"} />
              <CardArtist name={"Mono"} followers={"3456K"} />
              <CardArtist name={"Mono"} followers={"3456K"} />
              <CardArtist name={"Mono"} followers={"3456K"} />
              <CardArtist name={"Mono"} followers={"3456K"} />
              <CardArtist name={"Mono"} followers={"3456K"} />
              <CardArtist name={"Mono"} followers={"3456K"} />
              <CardArtist name={"Mono"} followers={"3456K"} />
              <CardArtist name={"Mono"} followers={"3456K"} />
              <CardArtist name={"Mono"} followers={"3456K"} />
              <CardArtist name={"Mono"} followers={"3456K"} />
              <CardArtist name={"Mono"} followers={"3456K"} />
              <CardArtist name={"Mono"} followers={"3456K"} />
            </Section> */}
          </div>
        </div>
      </div>
    </div>
  );
}
