import React, { useState } from "react";
import CommentItem from "../CommentItem";
import CommentInput from "../CommentInput";
import "./style.scss";
import { commentApi } from "../../apis";
import { useAuth } from "../../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "react-query";

const Comment = ({ songId }: { songId: string }) => {
  const [comments, setComments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [totalComment, setTotalComment] = React.useState<number>(0);
  const { currentUser } = useAuth();
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
  const queryClient = useQueryClient();

  const handleGetComments = async () => {
    setLoading(true);
    try {
      const res = await commentApi.getAllComments(
        songId,
        token,
        1,
        0,
        "",
        filter.name
      );
      setComments(res.data);
      setTotalComment(res.pagination.totalCount);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const {} = useQuery({
    queryKey: ["comments", songId],
    queryFn: async () => {
      await handleGetComments();
    },
  });

  React.useEffect(() => {
    handleGetComments();
  }, [songId, filter]);

  const mutationAdd = useMutation({
    mutationFn: async (content: string) => {
      if (content === "") return;
      try {
        await commentApi.addComment(songId, content, token);
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", songId]);
    },
  });

  return (
    <div className="Comment">
      <div className="Comment__container">
        <div className="Comment__container__header">
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
            <div
              className={`dropdown__content ${activeFilter ? "active" : ""}`}
            >
              <ul>
                {filterOptions.map((option) => (
                  <li
                    onClick={() => {
                      setFilter(option);
                      setActiveFilter(false);
                    }}
                  >
                    {option.value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="Comment__container__body">
          <div className="Comment__container__body__list">
            {comments.map((comment) => (
              <CommentItem
                id={comment?.comment_id}
                songId={comment?.song_id}
                userId={comment?.user_id}
                avatarUrl={comment?.image_path}
                name={comment?.name}
                time={comment?.created_at}
                content={comment?.content}
                level={0}
                replies={comment?.replies_count}
                count_like={comment?.count_like ?? 0}
              />
            ))}
          </div>
        </div>
        <div>
          <button className="load-more">Load more</button>
        </div>
      </div>
      <div className="Comment__input">
        <CommentInput
          onPost={(value) => mutationAdd.mutate(value)}
          avatarUrl={currentUser?.image_path ?? ""}
        />
      </div>
    </div>
  );
};

export default Comment;
