import React, { useState } from "react";
import CommentItem from "../CommentItem";
import Images from "../../constants/images";
import CommentInput from "../CommentInput/CommentInput";
import "./style.scss";
import { commentApi } from "../../apis";
import { useAuth } from "../../context/AuthContext";

const Comment = ({ songId }: { songId: string }) => {
  const [comments, setComments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [totalComment, setTotalComment] = React.useState<number>(0);
  const { token } = useAuth();
  const filterOptions = [
    { value: "Mới nhất", name: "new" },
    { value: "Cũ nhất", name: "old" },
    { value: "Phổ biến", name: "popular" },
  ];
  const [filter, setFilter] = useState<{ name: string; value: string }>(
    filterOptions[0]
  );
  const [activeFilter, setActiveFilter] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await commentApi.getAllComments(songId, token);
        setComments(res.data);
        setTotalComment(res.pagination.totalCount);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    fetchComments();
  }, [songId]);

  return (
    <div className="Comment">
      {/* <div className="Comment__input">
        <CommentInput avatarUrl={Images.AVATAR} />
      </div> */}
      <div className="Comment__header">
        <div className="quantity">
          <span>{totalComment} comments</span>
        </div>
        <div className="dropdown">
          <button
            className="dropdown__header"
            onClick={() => setActiveFilter(!activeFilter)}
          >
            <i className="fa-light fa-bars-sort"></i>
            <span>{filter.value}</span>
            <i className="fa-light fa-chevron-down"></i>
          </button>
          <div className={`dropdown__content ${activeFilter ? "active" : ""}`}>
            <ul>
              {
                filterOptions.map((option) => (
                  <li
                    onClick={() => {
                      setFilter(option);
                      setActiveFilter(false);
                    }}
                  >
                    {option.value}
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      </div>
      <div className="Comment__body">
        <div className="Comment__body__list">
          {comments.map((comment) => (
            <CommentItem
              avatarUrl={comment?.image_path}
              name={comment?.name}
              time={comment?.created_at}
              content={comment?.content}
              level={0}
              replies={comment?.replies_count}
            />
          ))}
        </div>
      </div>
      <div>
        <button className="load-more">Load more</button>
      </div>
    </div>
  );
};

export default Comment;
