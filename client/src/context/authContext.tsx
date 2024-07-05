import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi, userApi } from "../apis";
import { TUser } from "../types";

// Khai báo kiểu dữ liệu cho AuthContext
interface IAuthContext {
  currentUser: TUser | null;
  setCurrentUser: (user: TUser) => void;
  token: string;
  logout: () => void;
  login: (user: TUser, token: string) => void;
}

// Tạo AuthContext với giá trị mặc định là null
const AuthContext = createContext<IAuthContext | null>(null);

export function useAuth() {
  return useContext(AuthContext)!; // Bạn cần xác nhận rằng giá trị không phải null
}

type Props = {
  children: React.ReactNode;
};

export const AuthContextProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<TUser | null>(() => {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  });

  const [token, setToken] = useState<string>(() => {
    const tokenString = localStorage.getItem("token");
    return tokenString ? JSON.parse(tokenString) : null;
  });

  const login = async (user: TUser, token: string) => {
    setCurrentUser(user);
    setToken(token);
  };

  const logout = async () => {
    setCurrentUser(null);
    setToken("");
    await authApi.signout();
  };

  useEffect(() => {
    const getInfo = async () => {
      try {
        const res = token && (await userApi.getMe(token));
        res && setCurrentUser(res);
      } catch (error) {
        setCurrentUser(null);
      }
    };
    currentUser && getInfo();
  }, [token]);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
    localStorage.setItem("token", JSON.stringify(token));
  }, [currentUser, token]);

  // Cập nhật giá trị của AuthContextProvider
  const contextValue: IAuthContext = {
    currentUser,
    setCurrentUser,
    token,
    logout,
    login,
  };

  // Sử dụng AuthContext.Provider để cung cấp giá trị cho các component con
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
