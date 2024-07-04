import NextAuth, { DefaultSession } from "next-auth";

// Extend the built-in session interface
declare module "next-auth" {
  interface Session {
    token: {
      access_token: string;
      user: {
        name: string;
        email: string;
        picture: string;
      };
    } & DefaultSession;
  }
}
