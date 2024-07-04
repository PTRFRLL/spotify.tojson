import { auth } from "@/auth";
import { Playlist } from "@/types";
import { redirect } from "next/navigation";
import React from "react";
import PlaylistDisplay from "./PlaylistDisplay";
import DownloadButton from "../DownloadButton";

type PlaylistListProps = {
  fetchData: () => Promise<{ playlists: Playlist[]; total: number }>;
};

export default async function PlaylistList({ fetchData }: PlaylistListProps) {
  const { playlists, total } = await fetchData();

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
