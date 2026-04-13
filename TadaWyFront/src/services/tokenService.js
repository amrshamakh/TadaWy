import Cookies from "js-cookie";
import { ENV } from "@/config/env";
const TOKEN_KEY = ENV.ACCESS_TOKEN_KEY || "access_token";
const REFRESH_TOKEN_KEY = ENV.REFRESH_TOKEN_KEY || "refresh_token";

export const TokenService = {
  
  setToken: (token, refreshToken = null, expiresDays = 1) => {
    Cookies.set(TOKEN_KEY, token, {
      expires: expiresDays,
      secure: true,
      sameSite: "strict",
    });
    if (refreshToken) {
      Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
        expires: expiresDays * 7, // Typically refresh tokens last longer
        secure: true,
        sameSite: "strict",
      });
    }
  },

  
  getToken: () => {
    return Cookies.get(TOKEN_KEY);
  },

  getRefreshToken: () => {
    return Cookies.get(REFRESH_TOKEN_KEY);
  },


  removeToken: () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
  },


  hasToken: () => {
    return !!Cookies.get(TOKEN_KEY);
  },
};