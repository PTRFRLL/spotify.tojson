"use client";
import { HeroUIProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <SessionProvider
      refetchOnWindowFocus={false}
      refetchInterval={5 * 60}
    >
      <ThemeProvider attribute="class" defaultTheme="dark">
        <HeroUIProvider>{children}</HeroUIProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
