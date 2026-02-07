"use client";

import { Playlist } from "@/types";
import React from "react";
import PlaylistDisplay from "./PlaylistDisplay";
import DownloadButton from "../DownloadButton";

type PlaylistListProps = {
  playlists: Playlist[];
  total: number;
};

export default function PlaylistList({ playlists, total }: PlaylistListProps) {
  if (!playlists || playlists.length === 0) {
    return (
      <div className="max-w-2/3">
        <DownloadButton endpoint="playlists" count={total} left={<h1 className="text-xl font-bold">Playlists</h1>} />
        <p className="text-gray-500 mt-4">No playlists found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2/3">
      <DownloadButton endpoint="playlists" count={total} left={<h1 className="text-xl font-bold">Playlists</h1>} />
      <div>
        {playlists.map((playlist: Playlist, index: number) => (
          <PlaylistDisplay key={playlist.id} playlist={playlist} ranking={index} />
        ))}
      </div>
    </div>
  );
}
