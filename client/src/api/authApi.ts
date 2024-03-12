import { ListResponse, ResLoginApi } from "../model";
import axiosClient from "./axiosClient";

//: Promise<ResLoginApi>
const authApi = {
  signin(email: string, password: string) {
    const url = "auth/signin";
    return axiosClient.post(url, { email, password });
  },
  signup(username: string, password: string, name: string) {
    const url = "auth/signup";
    return axiosClient.post(url, { username, password, name });
  },
  signout() {
    const url = "auth/signout";
    return axiosClient.get(url);
  },
};

export default authApi;
 