"use client";

import { useState } from "react";
import {
  Navbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  Link,
  Button,
} from "@nextui-org/react";
import { FiMoon, FiSun } from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { APP_NAME } from "./constants";

export default function NavbarCustom() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    const newTheme = isDarkMode ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', !isDarkMode);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <Navbar isBordered variant="floating">
      <NavbarBrand>
        <Link href="/" className="flex items-center navbar-brand">
          <Image src="/favicon.ico" alt="Favicon" width={40} height={40} className="mr-1" />
          <p className="text-2xl font-bold ml-2" style={{ color: "rgb(3, 215, 165)" }}>
            SellScaleHood
          </p>
        </Link>
      </NavbarBrand>

      <NavbarContent className="navbar-content">
        <NavbarItem>
          <Link href="/" className="text-lg font-semibold navbar-item">
            Portfolio
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/trending" className="text-lg font-semibold navbar-item">
            Trending
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/search" className="text-lg font-semibold navbar-item">
            Search
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/faq" className="text-lg font-semibold navbar-item">
            FAQ
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <Button auto light onPress={toggleTheme} className="mr-2">
          {isDarkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
        </Button>
        <NavbarMenuToggle
          aria-label="Toggle Navigation"
          className="sm:flex"
        />
      </NavbarContent>
    </Navbar>
  );
}