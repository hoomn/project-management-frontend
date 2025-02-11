import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

import api from "./lib/api";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      initials: string;
      access: string;
      refresh: string;
      access_exp: number;
      refresh_exp: number;
    } & DefaultSession["user"];
  }

  interface User {
    user_id: string;
    user_initials: string;
    access: string;
    access_exp: number;
    refresh: string;
    refresh_exp: number;
  }
}
declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    user_id: string;
    user_initials: string;
    access: string;
    access_exp: number;
    refresh: string;
    refresh_exp: number;
  }
}

interface TokenResponse {
  access: string;
  refresh: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/auth/sign-in",
  },
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const tokens: TokenResponse = await api.post("/auth/jwt/create/", credentials);

          const access_decoded = JSON.parse(atob(tokens.access.split(".")[1]));
          const refresh_decoded = JSON.parse(atob(tokens.refresh.split(".")[1]));

          let user_info = null;
          try {
            user_info = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}auth/users/me/`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokens.access}`,
              },
            }).then((res) => {
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
              return res.json();
            });
          } catch (error) {
            console.log(error);
          }

          return {
            ...tokens,
            user_id: access_decoded.user_id,
            user_initials: user_info && user_info.initials ? user_info.initials : "--",
            access_exp: access_decoded.exp,
            refresh_exp: refresh_decoded.exp,
          };
        } catch (error) {
          console.log(error);
          // return user object with their profile data
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async authorized({ auth }) {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    async jwt({ token, user, account }) {
      // if (token.error === "RefreshTokenError") return null;

      if (account) {
        return {
          ...token,
          user_id: user.user_id,
          user_initials: user.user_initials,
          access: user.access,
          refresh: user.refresh,
          access_exp: user.access_exp,
          refresh_exp: user.refresh_exp,
        };
      } else if (Date.now() < token.access_exp * 1000) {
        // Subsequent logins, but the `access_token` is still valid

        return token;
      } else {
        // Subsequent logins, but the `access_token` has expired, try to refresh it

        if (!token.refresh) throw new TypeError("Missing refresh_token");

        try {
          // The auth() call is hanging because it's creating a circular dependency.
          // When your API client tries to get a token, it calls auth(), but auth()
          // is trying to use the API client to refresh tokens, creating an infinite loop.
          // const new_token = await api.post("/auth/jwt/refresh/", { refresh: token.refresh! });

          const new_token = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}auth/jwt/refresh/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh: token.refresh }),
          }).then((res) => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
          });

          const new_access_decoded = JSON.parse(atob(new_token.access.split(".")[1]));

          // Updatd expires_at
          return {
            ...token,
            access: new_token.access,
            access_exp: new_access_decoded.exp,
          };
        } catch (error) {
          console.log("Error refreshing access_token", error);
          return null;
        }
      }
    },
    async session({ session, token }) {
      // If there's a token error, end the session
      // if (token.error) return null;

      return {
        ...session,
        user: {
          ...session.user,
          id: token.user_id,
          initials: token.user_initials,
          access: token.access,
          access_exp: token.access_exp,
          refresh_exp: token.refresh_exp,
        },
      };
    },
  },
});
