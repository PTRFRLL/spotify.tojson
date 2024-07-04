"use client";

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
    <div className="flex flex-col gap-2 sm:flex-row items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold">Top Tracks</h1>
      </div>
      <div>
        <button
          className={
            !selectedTerm || selectedTerm === "short_term"
              ? "font-semibold border-b border-gray-800 dark:border-gray-100 mx-2"
              : "mx-2"
          }
          onClick={() => {
            setTerm("short_term");
          }}
        >
          Last 4 Weeks
        </button>
        <button
          className={
            selectedTerm === "medium_term" ? "font-semibold border-b border-gray-800 dark:border-gray-100 mx-2" : "mx-2"
          }
          onClick={() => {
            setTerm("medium_term");
          }}
        >
          Last 6 Months
        </button>
        <button
          className={
            selectedTerm === "long_term" ? "font-semibold border-b border-gray-800 dark:border-gray-100 mx-2" : "mx-2"
          }
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
