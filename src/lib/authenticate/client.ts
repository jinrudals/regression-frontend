import { api as internal } from "./bare";
import Cookies from "js-cookie";
import wretch, { Wretch, WretchError } from "wretch";

const handleRefresh = () => {
  const refreshToken = Cookies.get("refresh");
  return internal.post({ refresh: refreshToken }, "/auth/jwt/refresh");
};

export const api = () => {
  return wretch(process.env.NEXT_PUBLIC_BACKEND_URL).auth(
    `Bearer ${Cookies.get("access")}`
  );
};
