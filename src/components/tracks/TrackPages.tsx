"use client";

import { Pagination } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

export default function TrackPages({ total }: { total: number }) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setPage = (page: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);

    replace(`${pathname}?${params.toString()}`);
  };

  const page = searchParams.get("page");

  return <Pagination color="success" showControls page={page ? parseInt(page) : 1} total={total} onChange={setPage} />;
}
