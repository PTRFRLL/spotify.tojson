import { Track } from "@/types";
import Image from "next/image";
import React from "react";

export default function TrackDisplay({ track, number }: { track: Track; number: number }) {
  return (
    <div className="flex flex-row border-b border-divider w-full mt-4">
      <p className="text-sm font-bold text-default-400 min-w-4">{number + 1}</p>
      <div className="flex pl-3 gap-4">
        <div className="flex-shrink-0">
          <Image className="rounded" src={track.image} alt="Album image" width={50} height={50} />
        </div>
        <div className="flex flex-col">
          {track.name}

          <p className="text-default-500 mb-4 truncate w-60 sm:w-96 md:w-full">{track.artists.join(", ")}</p>
        </div>
      </div>
    </div>
  );
}
