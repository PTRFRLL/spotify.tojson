import paths from "@/paths";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Search from "../../public/search.svg";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center md:flex-row gap-4 justify-center">
      <div className="flex flex-col gap-4 m-w-2/3">
        <h1 className="text-5xl font-bold tracking-tighter xl:text-6xl/none">Hmm..</h1>
        <p className="text-muted-foreground md:text-xl">You look lost, maybe its back on the homepage? </p>

        <Link href={paths.top} className="underline">
          Back home
        </Link>
      </div>
      <Image src={Search} alt="Search" />
    </div>
  );
}
