"use client";

import { Track } from "@/types";
import React from "react";
import TrackDisplay from "./TrackDisplay";

type TrackListProps = {
  tracks: Track[];
};

function TopTracksList({ tracks }: TrackListProps) {
  if (!tracks || tracks.length === 0) {
    return <p className="text-default-500">No tracks found</p>;
  }

  return (
    <div>
      {tracks.map((track: Track, index: number) => (
        <TrackDisplay key={track.uri} track={track} number={index} />
      ))}
    </div>
  );
}

export default TopTracksList;
