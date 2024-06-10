import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "./lib/authenticate/bare";
import { cookies } from "next/headers";
import Cookies from "js-cookie";

declare module "next-auth" {
  interface User {
    accessToken: string;
    refreshToken: string;
    username: string;
  }

  interface Session {
    accessToken: string;
  }
}
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials;
        try {
          const response: {
            access: string;
            refresh: string;
          } = await api
            .url("/auth/jwt/create")
            .post({ username, password })
            .json();
          if (response.access && response.refresh) {
            cookies().set("access", response.access, {
              httpOnly: true,
            });
            Cookies.set("access", response.access);
            cookies().set("refresh", response.refresh);
            Cookies.set("refresh", response.refresh);

            return {
              accessToken: response.access,
              refreshToken: response.refresh,
              username: username as string,
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error("Error during authorization", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
});
