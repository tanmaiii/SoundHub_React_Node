import { TUser } from "./../../model/user";
import { ListResponse, ResLoginApi } from "../../model";
import axiosClient from "../axiosClient";

//: Promise<ResLoginApi>
const authApi = {
  signin(email: string, password: string): Promise<TUser> {
    const url = "auth/signin";
    return axiosClient.post(url, { email, password });
  },
  // async signin(email: string, password: string) {
  //   try {
  //     const url = "auth/signin";
  //     let res = await axiosClient.post(url, { email, password });
  //     return { data: res.data, status: { code: res.status, text: res.statusText } };
  //   } catch (err) {
  //     return {
  //       is_err: true,
  //       status: `failed!`,
  //       message: err,
  //     };
  //   }
  // },
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
