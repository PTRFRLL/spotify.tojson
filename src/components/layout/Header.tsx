import { signIn, signOut } from "@/actions";
import { auth } from "@/auth";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Link,
  Listbox,
  ListboxItem,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import React from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import HeaderAuth from "./HeaderAuth";
import HeaderLinks from "./HeaderLinks";
import Menu from "./Menu";

export default async function Header() {
  const session = await auth();

  let authContent: React.ReactNode;

  if (session?.user) {
    authContent = (
      <Popover>
        <PopoverTrigger>
          <Avatar src={session.user.image ?? ""} alt="User avatar" />
        </PopoverTrigger>
        <PopoverContent>
          <Card shadow="none" className="max-w-[300px] border-none bg-transparent">
            <CardHeader className="justify-between">
              <div className="flex gap-3">
                <Avatar isBordered radius="full" size="md" src={session.user.image ?? ""} />
                <div className="flex flex-col items-start justify-center">
                  <h4 className="text-small font-semibold leading-none text-default-600">{session.user.name}</h4>
                  <h5 className="text-small tracking-tight text-default-500">{session.user.email}</h5>
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-3 py-0"></CardBody>
            <CardFooter className="gap-3">
              <form action={signOut}>
                <Button fullWidth={true} variant="flat" color="danger" type="submit">
                  Sign out
                </Button>
              </form>
            </CardFooter>
          </Card>
        </PopoverContent>
      </Popover>
    );
  } else {
    authContent = null;
  }

  return (
    <Navbar isBordered className="mb-4">
      <NavbarContent justify="start">
        <HeaderLinks />
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        <NavbarItem>
          <HeaderAuth />
        </NavbarItem>
      </NavbarContent>
      <Menu />
    </Navbar>
  );
}
