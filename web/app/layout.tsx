import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "LoL.tracker — League of Legends Stats",
  description:
    "Modern League of Legends stat tracker. Search any Riot ID, view ranks, match history, and live games.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <QueryProvider>
          <Navbar />
          <main className="container py-8">{children}</main>
          <footer className="container py-8 text-xs text-muted-foreground text-center">
            LoL.tracker isn’t endorsed by Riot Games. League of Legends is a
            trademark of Riot Games, Inc.
          </footer>
        </QueryProvider>
      </body>
    </html>
  );
}
