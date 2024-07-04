import { auth } from "@/auth";
import { Track } from "@/types";
import { redirect } from "next/navigation";
import React from "react";
import DownloadButton from "../DownloadButton";
import TrackDisplay from "./TrackDisplay";

type PlaylistListProps = {
  fetchData: () => Promise<{ tracks: Track[]; total: number }>;
};

export default async function SavedTracksList({ fetchData }: PlaylistListProps) {
  const { tracks, total } = await fetchData();

  return (
    <div className="max-w-2/3">
      <DownloadButton endpoint="tracks" count={total} left={<h1 className="text-xl font-bold">Saved Tracks</h1>} />
      <div>
        {tracks.map((track: Track, index: number) => (
          <TrackDisplay key={track.id} track={track} number={index} />
        ))}
      </div>
    </div>
  );
}
