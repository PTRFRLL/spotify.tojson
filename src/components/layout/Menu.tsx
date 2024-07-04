"use client";
import { NAV_ITEMS } from "@/constants";
import paths from "@/paths";
import { Link, NavbarMenu, NavbarMenuItem } from "@nextui-org/react";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

import React from "react";

export default function Menu() {
  const pathname = usePathname();

  const session = useSession();

  const isAuthed = session.data?.user;

  return (
    <NavbarMenu>
      {NAV_ITEMS.map(({ href, name, isProtected }) => {
        if (isProtected && !isAuthed) return null;
        const isActive = pathname === href;
        return (
          <NavbarMenuItem key={href} isActive={isActive}>
            <Link href={href} color={"foreground"} className={clsx("w-full ", { "text-spoti": isActive })} size="lg">
              {name}
            </Link>
          </NavbarMenuItem>
        );
      })}
    </NavbarMenu>
  );
}
