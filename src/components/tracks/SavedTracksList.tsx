"use client";

import { Track } from "@/types";
import React from "react";
import TrackDisplay from "./TrackDisplay";
import TrackPages from "./TrackPages";

type SavedTracksListProps = {
  tracks: Track[];
  total: number;
  currentPage: number;
};

export default function SavedTracksList({ tracks, total, currentPage }: SavedTracksListProps) {
  const totalPages = Math.ceil(total / 50);
  const startIndex = (currentPage - 1) * 50;

  if (!tracks || tracks.length === 0) {
    return <p className="text-default-500">No saved tracks found</p>;
  }

  return (
    <>
      <div>
        {tracks.map((track: Track, index: number) => (
          <TrackDisplay key={track.id} track={track} number={startIndex + index} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <TrackPages total={totalPages} />
        </div>
      )}
    </>
  );
}
