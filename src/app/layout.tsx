import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Spotify Tools",
    default: "Spotify Tools",
  },
  description: "Export your Spotify data as JSON",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="container mx-auto px-4 max-w-6xl">
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
