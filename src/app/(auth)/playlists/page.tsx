"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useSpotifyClient } from "@/hooks/useSpotifyClient";
import { AuthError } from "@/lib/spotify-client";
import { Playlist } from "@/types";
import PlaylistList from "@/components/playlists/PlaylistList";
import TracksLoading from "@/components/tracks/TrackLoading";

export default function PlaylistPage() {
  const { client, status } = useSpotifyClient();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlaylists() {
      if (!client) return;

      try {
        setLoading(true);
        setError(null);
        const { playlists: fetchedPlaylists, total: totalCount } = await client.fetchUserPlaylists();
        setPlaylists(fetchedPlaylists);
        setTotal(totalCount);
      } catch (err) {
        if (err instanceof AuthError) {
          signOut({ callbackUrl: "/" });
          return;
        }
        console.error("Error fetching playlists:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch playlists");
      } finally {
        setLoading(false);
      }
    }

    fetchPlaylists();
  }, [client]);

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col gap-4 m-2">
        <TracksLoading />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col gap-4 m-2">
        <p>Please sign in to view your playlists.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 m-2">
        <div className="text-red-500">
          <h1 className="text-xl font-bold mb-2">Playlists</h1>
          <p>Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 m-2">
      <PlaylistList playlists={playlists} total={total} />
    </div>
  );
}
