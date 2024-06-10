import { api as internal } from "@/lib/authenticate/bare";
import { cookies } from "next/headers";
import wretch, { Wretch, WretchError } from "wretch";

export async function POST(request: Request) {
  const original = await request.json();
  const cookie = cookies();
  return Response.json(
    await internal
      .auth(`Bearer ${cookie.get("access")?.value}`)
      .url("/api/testcase/creation/")
      .catcher(401, async (error: WretchError, request: Wretch) => {
        const refresh = cookie.get("refresh")?.value;
        const { access } = (await internal
          .post("/auth/jwt/refresh")
          .json()) as {
          access: string;
        };
        cookie.set("access", access);
        request.auth(`Bearer ${access}`).fetch().json();
      })
      .post(original)
      .json()
  );
}
