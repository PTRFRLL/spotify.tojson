import { fetchSavedTracks } from "@/actions/spotify";
import SavedTracksList from "@/components/tracks/SavedTracksList";

import TracksLoading from "@/components/tracks/TrackLoading";
import { Metadata } from "next";

import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Saved Songs",
  description: "Export your saved Spotify songs as JSON",
};

export default async function SavedTracks() {
  return (
    <div className="flex flex-col gap-4 m-2">
      <Suspense fallback={<TracksLoading />}>
        <SavedTracksList fetchData={() => fetchSavedTracks(1)} />
      </Suspense>
    </div>
  );
}
