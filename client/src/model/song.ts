export interface TSong {
  id: number;
  title: string;
  user_id: string;
  genre_id: string;
  image_path?: string;
  song_path: string;
  private: number;
  author: string;
  created_at: string;
}
