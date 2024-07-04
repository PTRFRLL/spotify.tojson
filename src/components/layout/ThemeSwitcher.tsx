"use client";
import { Button } from "@nextui-org/react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { IoMoon, IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };
  return (
    <Button variant="light" isIconOnly onPress={toggleTheme}>
      {theme === "dark" ? <IoSunnyOutline /> : <IoMoon />}
    </Button>
  );
}
