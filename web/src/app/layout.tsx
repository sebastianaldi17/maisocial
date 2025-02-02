"use client";

import { Menu } from "lucide-react";
import "./globals.css";
import { useState } from "react";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <title>MaiSocial</title>
      <body>
        <div className="relative h-screen">
          {/* Sticky Header */}
          <header className="fixed top-0 left-0 w-full bg-pink-600 text-white flex items-center p-2 shadow-md z-50">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2">
              <Menu size={28} />
            </button>
            <Link className="ml-4 text-lg font-bold" href="/">
              MaiSocial
            </Link>
          </header>

          {/* Sidebar */}
          <div
            className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 ease-in-out z-50`}
          >
            <nav className="p-4 space-y-4">
              <Link href="/" className="block p-2 rounded hover:bg-gray-700">
                Songs
              </Link>
            </nav>
            <div className="p-4 border-t border-gray-700">
              <button className="w-full p-2 bg-red-600 rounded hover:bg-red-700">
                Logout
              </button>
            </div>
          </div>

          {/* Overlay (click outside sidebar to close) */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black opacity-50 z-40"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}

          <main className="pt-20">{children}</main>
        </div>
      </body>
    </html>
  );
}
