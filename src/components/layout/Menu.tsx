"use client";
import paths from "@/paths";
import { Link, NavbarMenu, NavbarMenuItem } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

import React from "react";

export default function Menu() {
  const pathname = usePathname();

  const session = useSession();

  const isAuthed = session.data?.user;

  return (
    <NavbarMenu>
      {isAuthed && (
        <NavbarMenuItem isActive={pathname === paths.top}>
          <Link href={paths.top} color={pathname === paths.top ? "primary" : "foreground"} className="w-full" size="lg">
            Top Tracks
          </Link>
        </NavbarMenuItem>
      )}
      {isAuthed && (
        <NavbarMenuItem isActive={pathname === paths.saved}>
          <Link
            href={paths.saved}
            color={pathname === paths.saved ? "primary" : "foreground"}
            className="w-full"
            size="lg"
          >
            Saved Tracks
          </Link>
        </NavbarMenuItem>
      )}
      {isAuthed && (
        <NavbarMenuItem isActive={pathname === paths.playlists}>
          <Link
            href={paths.playlists}
            color={pathname === paths.playlists ? "primary" : "foreground"}
            className="w-full"
            size="lg"
          >
            Playlists
          </Link>
        </NavbarMenuItem>
      )}
    </NavbarMenu>
  );
}
