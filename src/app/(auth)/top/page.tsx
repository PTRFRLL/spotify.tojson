"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useSpotifyClient } from "@/hooks/useSpotifyClient";
import { Track } from "@/types";
import TopTracksList from "@/components/tracks/TopTracksList";
import TracksLoading from "@/components/tracks/TrackLoading";
import DownloadButton from "@/components/DownloadButton";
import clsx from "clsx";

export default function TopTracks() {
  const { client, status } = useSpotifyClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const term = searchParams.get("term") || "short_term";

  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setTerm = (newTerm: string) => {
    const params = new URLSearchParams(searchParams);
    if (newTerm) {
      params.set("term", newTerm);
    } else {
      params.delete("term");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    async function fetchTracks() {
      if (!client) return;

      try {
        setLoading(true);
        setError(null);
        const { tracks: fetchedTracks } = await client.fetchTopTracks(term);
        setTracks(fetchedTracks);
      } catch (err) {
        console.error("Error fetching top tracks:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch tracks");
      } finally {
        setLoading(false);
      }
    }

    fetchTracks();
  }, [client, term]);

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col gap-4 m-2">
        <DownloadButton
          endpoint="top"
          count={0}
          term={term}
          left={<h1 className="text-xl font-bold">Top Tracks</h1>}
        />
        <div className="flex flex-wrap gap-2">
          <button
            aria-label="Last 4 weeks"
            className={clsx("px-3 py-1 rounded", {
              "font-semibold underline decoration-spoti": !term || term === "short_term",
            })}
            onClick={() => setTerm("short_term")}
          >
            Last 4 weeks
          </button>
          <button
            aria-label="Last 6 months"
            className={clsx("px-3 py-1 rounded", {
              "font-semibold underline decoration-spoti": term === "medium_term",
            })}
            onClick={() => setTerm("medium_term")}
          >
            Last 6 months
          </button>
          <button
            aria-label="Last year"
            className={clsx("px-3 py-1 rounded", {
              "font-semibold underline decoration-spoti": term === "long_term",
            })}
            onClick={() => setTerm("long_term")}
          >
            Last year
          </button>
        </div>
        <TracksLoading />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col gap-4 m-2">
        <p>Please sign in to view your top tracks.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 m-2">
        <DownloadButton
          endpoint="top"
          count={0}
          term={term}
          left={<h1 className="text-xl font-bold">Top Tracks</h1>}
        />
        <div className="flex flex-wrap gap-2">
          <button
            aria-label="Last 4 weeks"
            className={clsx("px-3 py-1 rounded", {
              "font-semibold underline decoration-spoti": !term || term === "short_term",
            })}
            onClick={() => setTerm("short_term")}
          >
            Last 4 weeks
          </button>
          <button
            aria-label="Last 6 months"
            className={clsx("px-3 py-1 rounded", {
              "font-semibold underline decoration-spoti": term === "medium_term",
            })}
            onClick={() => setTerm("medium_term")}
          >
            Last 6 months
          </button>
          <button
            aria-label="Last year"
            className={clsx("px-3 py-1 rounded", {
              "font-semibold underline decoration-spoti": term === "long_term",
            })}
            onClick={() => setTerm("long_term")}
          >
            Last year
          </button>
        </div>
        <div className="text-red-500">
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
      <DownloadButton
        endpoint="top"
        count={tracks.length}
        term={term}
        left={<h1 className="text-xl font-bold">Top Tracks</h1>}
      />
      <div className="flex flex-wrap gap-2">
        <button
          aria-label="Last 4 weeks"
          className={clsx("px-3 py-1 rounded", {
            "font-semibold underline decoration-spoti": !term || term === "short_term",
          })}
          onClick={() => setTerm("short_term")}
        >
          Last 4 weeks
        </button>
        <button
          aria-label="Last 6 months"
          className={clsx("px-3 py-1 rounded", {
            "font-semibold underline decoration-spoti": term === "medium_term",
          })}
          onClick={() => setTerm("medium_term")}
        >
          Last 6 months
        </button>
        <button
          aria-label="Last year"
          className={clsx("px-3 py-1 rounded", {
            "font-semibold underline decoration-spoti": term === "long_term",
          })}
          onClick={() => setTerm("long_term")}
        >
          Last year
        </button>
      </div>
      <TopTracksList tracks={tracks} />
    </div>
  );
}
