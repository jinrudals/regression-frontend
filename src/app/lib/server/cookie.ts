import { cookies } from "next/headers";
import wretch, { Wretch, WretchError } from "wretch";
import { api as ionternal } from "@/lib/authenticate/bare";

export const api = () => {
  return wretch(process.env.NEXT_PUBLIC_BACKEND_URL)
    .auth(`Bearer ${cookies().get("access")?.value}`)
    .catcher(401, async (error: WretchError, request: Wretch) => {
      try {
        const response = request
          .auth(`Bearer  ${cookies().get("access")?.value}`)
          .fetch();
        return response;
        //   .unauthorized(() => {});
      } catch (error) {}
    });
};
