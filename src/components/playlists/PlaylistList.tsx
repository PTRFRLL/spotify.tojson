"use client";

import { Playlist } from "@/types";
import React from "react";
import PlaylistDisplay from "./PlaylistDisplay";

type PlaylistListProps = {
  playlists: Playlist[];
};

export default function PlaylistList({ playlists }: PlaylistListProps) {
  if (!playlists || playlists.length === 0) {
    return <p className="text-default-500">No playlists found</p>;
  }

  return (
    <div>
      {playlists.map((playlist: Playlist, index: number) => (
        <PlaylistDisplay key={playlist.id} playlist={playlist} ranking={index} />
      ))}
    </div>
  );
}
