"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useSpotifyClient } from "@/hooks/useSpotifyClient";
import { AuthError } from "@/lib/spotify-client";
import { Playlist } from "@/types";
import PlaylistList from "@/components/playlists/PlaylistList";
import TracksLoading from "@/components/tracks/TrackLoading";
import DownloadButton from "@/components/DownloadButton";

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

  if (status === "unauthenticated") {
    return <p>Please sign in to view your playlists.</p>;
  }

  // Same header in every branch, so the list doesn't reflow between loading and loaded.
  const header = (
    <DownloadButton endpoint="playlists" count={total} left={<h1 className="text-xl font-bold">Playlists</h1>} />
  );

  if (status === "loading" || loading) {
    return (
      <>
        {header}
        <TracksLoading />
      </>
    );
  }

  if (error) {
    return (
      <>
        {header}
        <div className="text-danger">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()} className="mt-2 underline">
            Try again
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {header}
      <PlaylistList playlists={playlists} />
    </>
  );
}
