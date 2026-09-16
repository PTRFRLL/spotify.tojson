"use client";

import { Skeleton } from "@heroui/react";
import React from "react";

function TrackLoading({ number }: { number: number }) {
  return (
    <div className="flex flex-row border-b border-divider w-full mt-4 pb-4">
      <p className="text-sm font-bold text-default-400 min-w-4">{number + 1}</p>
      <div className="flex pl-3 gap-4">
        <Skeleton className="h-[50px] w-[50px] rounded flex-shrink-0" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  );
}

function TracksLoading({ startIndex = 0 }: { startIndex?: number }) {
  return Array.from({ length: 15 }).map((_, index) => <TrackLoading key={index} number={startIndex + index} />);
}

export default TracksLoading;
