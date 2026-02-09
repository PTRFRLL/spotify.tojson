"use client";
import React from "react";

import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";

import { signOut as nextAuthSignOut } from "next-auth/react";
export default function HeaderAuth({ version }: { version?: string }) {
  const session = useSession();

  const handleSelect = async (key: React.Key) => {
    switch (key) {
      case "logout":
        await nextAuthSignOut();
      default:
        return;
    }
  };

  if (session.status == "loading" || !session.data?.user) {
    return null;
  }

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          src={session?.data?.token.user.picture ?? ""}
          alt="User avatar"
        />
      </DropdownTrigger>
      <DropdownMenu variant="flat" onAction={handleSelect}>
        <DropdownItem isReadOnly key="profile" className="h-14 gap-2">
          <p className="font-semibold">Signed in as</p>
          <p className="font-semibold">{session.data.token.user.name}</p>
        </DropdownItem>

        <DropdownItem key="logout" color="danger">
          Log Out
        </DropdownItem>
        <DropdownItem
          isReadOnly
          key="version"
          className="cursor-default"
          textValue={version ? `v${version}` : ""}
        >
          {version && <p className="text-xs text-default-400">v{version}</p>}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
