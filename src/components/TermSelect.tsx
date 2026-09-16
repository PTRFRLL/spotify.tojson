"use client";

import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const TERMS = [
  { value: "short_term", label: "Last 4 weeks" },
  { value: "medium_term", label: "Last 6 months" },
  { value: "long_term", label: "Last year" },
];

export default function TermSelect() {
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

  const selectedTerm = searchParams.get("term") || "short_term";

  return (
    <div className="flex flex-wrap gap-2">
      {TERMS.map(({ value, label }) => (
        <button
          key={value}
          aria-label={label}
          className={clsx("px-3 py-1 rounded", {
            "font-semibold underline decoration-spoti": selectedTerm === value,
          })}
          onClick={() => setTerm(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
