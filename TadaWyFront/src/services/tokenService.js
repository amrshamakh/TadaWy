import Cookies from "js-cookie";
import { ENV } from "@/config/env";
const TOKEN_KEY = ENV.ACCESS_TOKEN_KEY || "access_token";

export const TokenService = {
  
  setToken: (token, expiresDays = 1) => {
    Cookies.set(TOKEN_KEY, token, {
      expires: expiresDays,
      secure: true,
      sameSite: "strict",
    });
  },

  
  getToken: () => {
    return Cookies.get(TOKEN_KEY);
  },


  removeToken: () => {
    Cookies.remove(TOKEN_KEY);
  },


  hasToken: () => {
    return !!Cookies.get(TOKEN_KEY);
  },
};