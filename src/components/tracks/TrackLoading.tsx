import { Skeleton } from "@nextui-org/react";
import React from "react";

function TrackLoading({ number }: { number: number }) {
  return (
    <div className="flex flex-row border-b border-gray-200 dark:border-gray-800 w-full mt-4 pb-4">
      <p className="text-sm font-bold text-gray-400 dark:text-gray-600 min-w-4">{number + 1}</p>
      <div className="flex pl-3 gap-4">
        <Skeleton className="h-12 w-12 rounded" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  );
}

function TracksLoading() {
  return Array.from({ length: 15 }).map((_, index) => <TrackLoading key={index} number={index} />);
}

export default TracksLoading;
