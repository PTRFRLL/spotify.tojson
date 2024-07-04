import { fetchTopTracks } from "@/actions/spotify";
import TermSelect from "@/components/TermSelect";
import TopTracksList from "@/components/tracks/TopTracksList";
import TracksLoading from "@/components/tracks/TrackLoading";
import { Suspense } from "react";

type Props = {
  searchParams?: {
    term: string;
  };
};

export default async function TopTracks({ searchParams }: Props) {
  return (
    <div className="flex flex-col gap-4 m-2">
      <Suspense fallback={<TracksLoading />}>
        <TermSelect />
        <TopTracksList fetchData={() => fetchTopTracks(searchParams?.term)} />
      </Suspense>
    </div>
  );
}
