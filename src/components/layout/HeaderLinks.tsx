"use client";

import paths from "@/paths";
import { NavbarItem, NavbarMenuToggle } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function HeaderLinks() {
  const pathname = usePathname();
  const session = useSession();

  const isAuthed = session.data?.user;

  return (
    <>
      {isAuthed && <NavbarMenuToggle className="sm:hidden" />}
      {!isAuthed && (
        <NavbarItem isActive={pathname === paths.home}>
          <Link className="text-xl" href={paths.home}>
            Spotify Tools
          </Link>
        </NavbarItem>
      )}

      {isAuthed && (
        <NavbarItem isActive={pathname === paths.top} className="hidden sm:flex">
          <Link href={paths.top}>Top Tracks</Link>
        </NavbarItem>
      )}
      {isAuthed && (
        <NavbarItem isActive={pathname === paths.saved} className="hidden sm:flex">
          <Link href={paths.saved}>Saved Tracks</Link>
        </NavbarItem>
      )}
      {isAuthed && (
        <NavbarItem isActive={pathname === paths.playlists} className="hidden sm:flex">
          <Link href={paths.playlists}>Playlists</Link>
        </NavbarItem>
      )}
    </>
  );
}
