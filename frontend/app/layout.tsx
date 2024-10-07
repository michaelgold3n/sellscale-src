"use client";

import { NextUIProvider } from "@nextui-org/react";
import { Poppins } from "next/font/google";
import { SnackbarProvider } from "notistack";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Local
import "./globals.css";
import NavbarCustom from "./navbar";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        <NextThemesProvider attribute="class" defaultTheme="light">
          <NextUIProvider>
            <SnackbarProvider>
              <NavbarCustom />
              <main className="topography-background min-h-screen">
                {children}
              </main>
            </SnackbarProvider>
          </NextUIProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}