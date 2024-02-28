export interface ReqLogin {
  username: string;
  password: string;
  email: string;
}

export interface ResLoginApi {
  id: string;
  name: string;
  email: string;
  image_path: string;
  verified: number;
  is_admin: number;
}