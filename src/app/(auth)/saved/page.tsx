"use client";

import { useEffect, useState, Suspense } from "react";
import { signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useSpotifyClient } from "@/hooks/useSpotifyClient";
import { AuthError } from "@/lib/spotify-client";
import { Track } from "@/types";
import SavedTracksList from "@/components/tracks/SavedTracksList";
import TracksLoading from "@/components/tracks/TrackLoading";

function SavedTracksContent() {
  const { client, status } = useSpotifyClient();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  const [tracks, setTracks] = useState<Track[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTracks() {
      if (!client) return;

      try {
        setLoading(true);
        setError(null);
        const { tracks: fetchedTracks, total: totalCount } = await client.fetchSavedTracks(page);
        setTracks(fetchedTracks);
        setTotal(totalCount);
      } catch (err) {
        if (err instanceof AuthError) {
          signOut({ callbackUrl: "/" });
          return;
        }
        console.error("Error fetching saved tracks:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch tracks");
      } finally {
        setLoading(false);
      }
    }

    fetchTracks();
  }, [client, page]);

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col gap-4 m-2">
        <TracksLoading startIndex={(page - 1) * 50} />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col gap-4 m-2">
        <p>Please sign in to view your saved tracks.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 m-2">
        <div className="text-red-500">
          <h1 className="text-xl font-bold mb-2">Saved Tracks</h1>
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
      <SavedTracksList tracks={tracks} total={total} currentPage={page} />
    </div>
  );
}

export default function SavedTracks() {
  return (
    <Suspense fallback={<TracksLoading startIndex={0} />}>
      <SavedTracksContent />
    </Suspense>
  );
}
