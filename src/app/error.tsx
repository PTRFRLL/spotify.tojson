"use client";

import paths from "@/paths";
import { Button } from "@nextui-org/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { FaSignOutAlt } from "react-icons/fa";
import Error from "../../public/error.svg";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center md:flex-row gap-8 justify-center">
      <div className="flex flex-col gap-8 m-w-2/3">
        <h1 className="text-5xl font-bold tracking-tighter xl:text-6xl/none">Oops!</h1>
        <p className="text-muted-foreground md:text-xl">
          Something unexpected happened. You can try again or if that doesn&apos;t work try signing out and back in
        </p>

        <Button aria-label="try again" type="submit" onPress={() => reset()} className="bg-green">
          Try again
        </Button>
      </div>
      <div className="m-w-1/3">
        <Image src={Error} alt="Error" />
      </div>
    </div>
  );
}
