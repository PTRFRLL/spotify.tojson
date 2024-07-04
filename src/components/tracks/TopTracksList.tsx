import { auth } from "@/auth";
import { Artist, SpotifyTrack, Track } from "@/types";

import React from "react";
import TrackDisplay from "./TrackDisplay";
import { redirect } from "next/navigation";

type TrackListProps = {
  fetchData: () => Promise<{ tracks: Track[]; total: number }>;
};

async function TopTracksList({ fetchData }: TrackListProps) {
  // const session = await auth();

  // if (!session) {
  //   redirect("/");
  // }

  const { tracks, total } = await fetchData();
  return (
    <div className="max-w-2/3">
      {tracks.map((track: Track, index: number) => (
        <TrackDisplay key={track.uri} track={track} number={index} />
      ))}
    </div>
  );
}

export default TopTracksList;
