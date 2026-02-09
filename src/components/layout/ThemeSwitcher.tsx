"use client";
import { Button } from "@nextui-org/react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { IoMoon, IoSunnyOutline, IoCloudyNightOutline } from "react-icons/io5";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <Button
      variant="light"
      isIconOnly
      onPress={toggleTheme}
      aria-label="Toggle Theme"
    >
      {mounted ? (
        theme === "dark" ? (
          <IoSunnyOutline size={"1.2em"} />
        ) : (
          <IoMoon size={"1.2em"} />
        )
      ) : (
        <IoCloudyNightOutline size={"1.2em"} />
      )}
    </Button>
  );
}
