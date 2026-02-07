"use client";

import { Track } from "@/types";
import React from "react";
import DownloadButton from "../DownloadButton";
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
    return (
      <div className="max-w-2/3">
        <DownloadButton endpoint="tracks" count={total} left={<h1 className="text-xl font-bold">Saved Tracks</h1>} />
        <p className="text-gray-500 mt-4">No saved tracks found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2/3">
      <DownloadButton endpoint="tracks" count={total} left={<h1 className="text-xl font-bold">Saved Tracks</h1>} />
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
    </div>
  );
}
