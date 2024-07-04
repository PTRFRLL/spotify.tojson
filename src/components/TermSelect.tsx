"use client";

import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

function TermSelect() {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setTerm = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("term", term);
    } else {
      params.delete("term");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const selectedTerm = searchParams.get("term");

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
      <div>
        <h1 className="text-xl font-bold">Top Tracks</h1>
      </div>
      <div>
        <button
          className={clsx("mx-2", {
            "font-semibold mx-2 underline decoration-spoti": !selectedTerm || selectedTerm === "short_term",
          })}
          onClick={() => {
            setTerm("short_term");
          }}
        >
          Last 4 Weeks
        </button>
        <button
          className={clsx("mx-2", {
            "font-semibold mx-2 underline decoration-spoti": selectedTerm === "medium_term",
          })}
          onClick={() => {
            setTerm("medium_term");
          }}
        >
          Last 6 Months
        </button>
        <button
          className={clsx("mx-2", {
            "font-semibold mx-2 underline decoration-spoti": selectedTerm === "long_term",
          })}
          onClick={() => {
            setTerm("long_term");
          }}
        >
          Last Year
        </button>
      </div>
    </div>
  );
}

export default TermSelect;
