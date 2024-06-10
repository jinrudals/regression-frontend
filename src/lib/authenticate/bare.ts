import wretch, { Wretch, WretchError } from "wretch";

export const api = wretch(process.env.NEXT_PUBLIC_BACKEND_URL).accept(
  "application/json"
);
