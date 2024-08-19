import React, { useEffect } from "react";
import "./style.scss";
import { Helmet } from "react-helmet-async";
import { useQuery } from "react-query";
import { genreApi } from "../../apis";
import HeaderSection from "../../components/HeaderSection";
import { useParams } from "react-router-dom";

export default function SearchPage() {
  const [keyWord, setKeyWord] = React.useState("");
  const params = useParams();

  useEffect(() => {
    params.keyword ? setKeyWord(params.keyword) : setKeyWord("");
  });

  return (
    <div className="SearchPage">
      <Helmet>
        <title>{`Search | Sound hub`}</title>
      </Helmet>
      <div className="SearchPage__container">
        {!keyWord ? (
          <GenresPage />
        ) : (
          <>
            <div className="SearchPage__container__header">
              <HeaderSection title={keyWord} />
            </div>
            <div className="SearchPage__container__body"></div>
          </>
        )}
      </div>
    </div>
  );
}

const GenresPage = () => {
  const { data: genres } = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      try {
        const res = await genreApi.getAll(1, 0);
        return res.data;
      } catch (error: any) {
        console.log(error.response.data);
        return;
      }
    },
  });

  return (
    <div className="GenresPage ">
      <div className="GenresPage__header">
        <HeaderSection title="Duyệt tìm tất cả" />
      </div>
      <div className="GenresPage__list row ">
        {genres?.map((genre) => (
          <div className="col pc-2-4 t-3 m-6">
            <div
              className="item__genre"
              key={genre.id}
              style={{ backgroundColor: genre.color }}
            >
              <p>{genre.title}</p>
              <img
                src={
                  "http://localhost:8000/image/7985b107-fe5a-49cc-9802-593cc0675e7b.png"
                }
                alt=""
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
