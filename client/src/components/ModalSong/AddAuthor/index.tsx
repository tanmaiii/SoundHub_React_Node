import React, { useEffect, useState, useTransition } from "react";
import { searchApi, userApi } from "../../../apis";
import CustomInput from "../../../components/CustomInput";
import { useAuth } from "../../../context/AuthContext";
import { ResSoPaAr, TUser } from "../../../types";
import "./style.scss";
import ImageWithFallback from "../../ImageWithFallback";
import Images from "../../../constants/images";
import numeral from "numeral";
import { useTranslation } from "react-i18next";

const ModalAddAuthor = ({
  authors: selectedAuthors,
  setAuthors: setSelectedAuthors,
}: {
  authors: string[];
  setAuthors: (authors: string[]) => void;
}) => {
  const [authors, setAuthors] = useState<ResSoPaAr[] | undefined>(undefined);
  const [keyword, setKeyword] = useState("");
  const { token } = useAuth();
  const { t } = useTranslation("song");

  const handleGetAuthor = async () => {
    try {
      const res = await searchApi.getArtists(token, 1, 10, keyword);
      res.data && setAuthors(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAuthor();
  }, [keyword]);

  const handleClick = () => {
    handleGetAuthor();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  return (
    <div className="modal__search-author">
      <div className="modal__search-author__header">
        <div className="modal__search-author__header__input">
          <CustomInput
            onSubmit={(text) => setKeyword(text)}
            placeholder={t("Author.Enter artist name")}
            onKeyDown={handleKeyPress}
          />
          <button className="btn-search" onClick={handleClick}>
            <i className="fa-regular fa-magnifying-glass"></i>
          </button>
        </div>
      </div>
      <div className="modal__search-author__body">
        <div className="modal__search-author__body__list">
          {authors?.length === 0 && (
            <div className="modal__search-author__body__list__empty">
              <span>{t("Author.No results found")}</span>
            </div>
          )}
          {authors?.map((author) => (
            <AuthorItem
              authors={selectedAuthors}
              setAuthors={setSelectedAuthors}
              key={author.id}
              id={author?.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const AuthorItem = ({
  id,
  authors,
  setAuthors,
}: {
  id: string;
  authors: string[];
  setAuthors: (authors: string[]) => void;
}) => {
  const [author, setAuthor] = useState<TUser | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const res = await userApi.getDetail(id);
        res && setAuthor(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAuthor();
  }, [id]);

  const handleAdd = () => {
    setAuthors([...authors, id]);
  };

  const handleRemove = () => {
    setAuthors(authors.filter((authorId) => authorId !== id));
  };

  if (currentUser?.id === id) return null;

  return (
    author && (
      <div className="author-item">
        <ImageWithFallback
          src={author?.image_path}
          alt={author?.name}
          fallbackSrc={Images.AVATAR}
        />
        <div className="author-item__desc">
          <h6>{author?.name}</h6>
          <span>
            {numeral(author?.count).format("0a").toUpperCase()} followers
          </span>
        </div>
        {authors.filter((authorId) => authorId === id).length > 0 ? (
          <button className="btn-remove" onClick={() => handleRemove()}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        ) : (
          <button className="btn-add" onClick={() => handleAdd()}>
            <i className="fa-solid fa-plus"></i>
          </button>
        )}
      </div>
    )
  );
};

export { AuthorItem };

export default ModalAddAuthor;
