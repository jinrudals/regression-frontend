"use server";
import { cookies } from "next/headers";
import wretch, { Wretch, WretchError } from "wretch";
import { api as internal } from "@/lib/authenticate/bare";
const handleRefresh = async () => {
  const response = (await internal
    .url("/auth/jwt/refresh")
    .post({ refresh: cookies().get("refresh") })
    .json()) as {
    access: string;
  };
  cookies().set("access", response.access);

  console.log("Access done?");
  return response;
};

export async function api() {
  return wretch(process.env.NEXT_PUBLIC_BACKEND_URL)
    .auth(`Bearer ${cookies().get("access")?.value}`)
    .catcher(401, async (error: WretchError, request: Wretch) => {
      try {
        const rep = await handleRefresh();
        const response = request
          .auth(`Bearer  ${cookies().get("access")?.value}`)
          .fetch();
        console.log(response);
        return response;
      } catch (error) {}
    });
}
