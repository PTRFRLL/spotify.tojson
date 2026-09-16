"use client";

import { useEffect, useState, Suspense } from "react";
import { signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useSpotifyClient } from "@/hooks/useSpotifyClient";
import { AuthError } from "@/lib/spotify-client";
import { Track } from "@/types";
import TopTracksList from "@/components/tracks/TopTracksList";
import TracksLoading from "@/components/tracks/TrackLoading";
import DownloadButton from "@/components/DownloadButton";
import TermSelect from "@/components/TermSelect";

function TopTracksContent() {
  const { client, status } = useSpotifyClient();
  const searchParams = useSearchParams();
  const term = searchParams.get("term") || "short_term";

  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTracks() {
      if (!client) return;

      try {
        setLoading(true);
        setError(null);
        const { tracks: fetchedTracks } = await client.fetchTopTracks(term);
        setTracks(fetchedTracks);
      } catch (err) {
        if (err instanceof AuthError) {
          signOut({ callbackUrl: "/" });
          return;
        }
        console.error("Error fetching top tracks:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch tracks");
      } finally {
        setLoading(false);
      }
    }

    fetchTracks();
  }, [client, term]);

  if (status === "unauthenticated") {
    return <p>Please sign in to view your top tracks.</p>;
  }

  // Same header in every branch, so switching term or hitting an error doesn't reflow the page.
  const header = (
    <>
      <DownloadButton
        endpoint="top"
        count={tracks.length}
        term={term}
        left={<h1 className="text-xl font-bold">Top Tracks</h1>}
      />
      <TermSelect />
    </>
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
      <TopTracksList tracks={tracks} />
    </>
  );
}

export default function TopTracks() {
  return (
    <Suspense fallback={<TracksLoading />}>
      <TopTracksContent />
    </Suspense>
  );
}
