import NextAuth from "next-auth";
import Spotify from "next-auth/providers/spotify";
import paths from "./paths";
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const clientId = process.env.SPOTIFY_CLIENT_ID;
const secret = process.env.SPOTIFY_CLIENT_SECRET;

if (!clientId || !secret) {
  throw new Error("Invalid Spotify credentials");
}

const basic = Buffer.from(`${clientId}:${secret}`).toString("base64");
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Spotify({
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-email,user-top-read,user-library-read,playlist-read-private",
      clientId: clientId,
      clientSecret: secret,
    }),
  ],
  pages: {
    signIn: paths.home,
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      return isLoggedIn;
    },
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin

      if (account) {
        return {
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
          user: {
            name: token.name,
            email: token.email,
            picture: token.picture,
          },
        };
        //@ts-ignore
      } else if (Date.now() < token.expires_at * 1000) {
        return token;
      } else {
        if (!token.refresh_token) throw new Error("Missing refresh token");
        try {
          // The `token_endpoint` can be found in the provider's documentation. Or if they support OIDC,
          // at their `/.well-known/openid-configuration` endpoint.
          // i.e. https://accounts.google.com/.well-known/openid-configuration
          const response = await fetch(TOKEN_ENDPOINT, {
            headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Basic ${basic}` },
            body: new URLSearchParams({
              grant_type: "refresh_token",
              refresh_token: token.refresh_token as string,
            }),
            cache: "no-cache",
            method: "POST",
          });

          const responseTokens = await response.json();

          if (!response.ok) throw responseTokens;

          return {
            // Keep the previous token properties
            ...token,
            access_token: responseTokens.access_token,
            expires_at: Math.floor(Date.now() / 1000 + (responseTokens.expires_in as number)),
            // Fall back to old refresh token, but note that
            // many providers may only allow using a refresh token once.
            refresh_token: responseTokens.refresh_token ?? token.refresh_token,
          };
        } catch (error) {
          console.error("Error refreshing access token", error);
          // The error property can be used client-side to handle the refresh token error
          return { ...token, error: "RefreshAccessTokenError" as const };
        }
      }
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      return {
        ...session,
        token,
      };
    },
  },
});
