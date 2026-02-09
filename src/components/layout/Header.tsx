import { Button, Link, Navbar, NavbarContent, NavbarItem } from "@nextui-org/react";
import React from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import HeaderAuth from "./HeaderAuth";
import HeaderLinks from "./HeaderLinks";
import Menu from "./Menu";
import { FaGithub } from "react-icons/fa6";
import { REPO_PATH } from "@/constants";
import packageJson from "../../../package.json";

export default async function Header() {
  return (
    <Navbar isBordered className="mb-4">
      <HeaderLinks />

      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} href={REPO_PATH} variant="light" isIconOnly target="_blank" aria-label="Toggle Theme">
            <FaGithub size={"1.2em"} />
          </Button>
        </NavbarItem>
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        <NavbarItem>
          <HeaderAuth version={packageJson.version} />
        </NavbarItem>
      </NavbarContent>
      <Menu />
    </Navbar>
  );
}
