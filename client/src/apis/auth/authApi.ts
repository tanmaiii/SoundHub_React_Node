import { ResVerifyForgotPassword } from "./../../types/auth.type";
import { TUser, ResLoginApi } from "./../../types";
import { axiosClient } from "../../configs";

//: Promise<ResLoginApi>
const authApi = {
  signin(email: string, password: string): Promise<ResLoginApi> {
    const url = "auth/signin";
    return axiosClient.post(url, { email, password });
  },
  signup(
    email: string,
    password: string,
    name: string,
    brithday: string,
    gender: string
  ): Promise<TUser> {
    const url = "auth/signup";
    return axiosClient.post(url, { email, password, name, brithday, gender });
  },

  signout() {
    const url = "auth/signout";
    return axiosClient.get(url);
  },
  checkEmail(email: string) {
    const url = "user/email";
    return axiosClient.post(url, { email });
  },
  sendVerifyEmail(
    token: string,
    email: string
  ): Promise<{ success: boolean; data: string }> {
    const url = "auth/send-verify-email";
    return axiosClient.post(
      url,
      { email },
      {
        headers: {
          authorization: token,
        },
      }
    );
  },
  verifyEmail(
    token: string,
    email: string,
    code: string
  ): Promise<{ success: boolean; data: string }> {
    const url = "auth/verify-email";
    return axiosClient.post(
      url,
      { email, code },
      {
        headers: {
          authorization: token,
        },
      }
    );
  },
  sendVerifyAccount(email: string) {
    const url = "auth/send-verify-account";
    return axiosClient.post(url, { email });
  },
  verifyAccount(
    email: string,
    token: string
  ): Promise<{ success: boolean; data: string }> {
    const url = "auth/verify-account";
    return axiosClient.post(url, { email, token });
  },
  verifyForgotPassword(
    email: string,
    code: string
  ): Promise<ResVerifyForgotPassword> {
    const url = "auth/verify-forgot-password";
    return axiosClient.post(url, { email, code });
  },
  changePassword(token: string, password: string, passwordOld: string) {
    const url = "auth/change-password";
    return axiosClient.post(
      url,
      {
        password,
        passwordOld,
      },
      {
        headers: {
          authorization: token,
        },
      }
    );
  },
  fogrotPassword(email: string) {
    const url = "auth/forgot-password";
    return axiosClient.post(url, { email });
  },
  resetPassword(resetPasswordToken: string, password: string) {
    const url = "auth/reset-password";
    return axiosClient.post(`${url}?token=${resetPasswordToken}`, {
      password,
    });
  },
};

export default authApi;
