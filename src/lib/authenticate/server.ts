import { cookies } from "next/headers";
import wretch, { Wretch, WretchError } from "wretch";
import { api as internal } from "./bare";
import { temp } from "./temp";
const handleRefresh = async () => {
  const response = await fetch(".//lib/server", {
    method: "POST",
  });
};

export const api = () => {
  return wretch(process.env.NEXT_PUBLIC_BACKEND_URL)
    .auth(`Bearer ${cookies().get("access")?.value}`)
    .catcher(401, async (error: WretchError, request: Wretch) => {
      "use server";
      try {
        console.log("ERROR :: ");
        console.log(request._url);
        const response1 = await temp();

        const response = request
          .auth(`Bearer  ${cookies().get("access")?.value}`)
          .fetch();
        console.log(response);
        return response;
      } catch (error) {}
    });
};
