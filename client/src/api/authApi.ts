import axiosClient from "./axiosClient";

const authApi = {
  signin: (email: string, password: string) => {
    const url = "auth/signin";
    return axiosClient.post(url, { email, password });
  },
  signup: (username: string, password: string, name: string) => {
    const url = "auth/signup";
    return axiosClient.post(url, { username, password, name });
  },
};

export default authApi;
