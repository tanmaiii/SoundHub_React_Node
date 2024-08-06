type TStatus = "Pending" | "Accepted" | "Rejected";

export type TAuthor = {
  song_id: string;
  user_id: string;
  status: TStatus;
  created_at: string;
  response_at: string;
};
