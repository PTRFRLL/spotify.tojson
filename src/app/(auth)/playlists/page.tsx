import { fetchUserPlaylists } from "@/actions/spotify";
import PlaylistList from "@/components/playlists/PlaylistList";
import TracksLoading from "@/components/tracks/TrackLoading";
import React, { Suspense } from "react";

export default async function PlaylistPage() {
  return (
    <div className="flex flex-col gap-4 m-2">
      <Suspense fallback={<TracksLoading />}>
        <PlaylistList fetchData={() => fetchUserPlaylists()} />
      </Suspense>
    </div>
  );
}
