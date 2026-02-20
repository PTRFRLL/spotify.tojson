import { useEffect, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import { SpotifyClient } from "@/lib/spotify-client";

/**
 * React hook that provides an authenticated Spotify API client
 *
 * Usage:
 * ```tsx
 * const { client, status } = useSpotifyClient();
 *
 * if (status === "loading") return <div>Loading...</div>;
 * if (status === "unauthenticated") return <div>Please sign in</div>;
 *
 * // Use client to make API calls
 * const data = await client.fetchTopTracks("short_term");
 * ```
 */
export function useSpotifyClient() {
  const { data: session, status, update } = useSession();

  // Auto sign-out if the server-side token refresh failed
  useEffect(() => {
    if (session?.token?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/" });
    }
  }, [session?.token?.error]);

  // Create a memoized client instance that only changes when session changes
  const client = useMemo(() => {
    if (!session) {
      return null;
    }

    // Pass the session and an update callback to the client
    return new SpotifyClient(session, (updatedSession) => {
      // Update the session when tokens are refreshed
      update(updatedSession);
    });
  }, [session, update]);

  return {
    client,
    status,
    session,
  };
}
