"use client";

import { NAV_ITEMS, SITE_NAME } from "@/constants";
import paths from "@/paths";
import { Navbar, NavbarContent, NavbarItem, NavbarMenuToggle } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function HeaderLinks() {
  const pathname = usePathname();
  const session = useSession();

  const isAuthed = session.data?.user;
  const isLoading = session.status === "loading";

  return (
    <NavbarContent justify="start">
      {isAuthed && <NavbarMenuToggle className="sm:hidden" />}
      {!isAuthed && (
        <NavbarItem className="brand">
          <Link className="text-xl brand font-mono" href={paths.home}>
            {SITE_NAME}
          </Link>
        </NavbarItem>
      )}

      {!isLoading && NAV_ITEMS.map(({ href, name, isProtected }) => {
        if (isProtected && !isAuthed) return null;
        return (
          <NavbarItem key={href} isActive={pathname === href} className="hidden sm:flex text-md">
            <Link href={href}>{name}</Link>
          </NavbarItem>
        );
      })}
    </NavbarContent>
  );
}
