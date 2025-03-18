"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "@/contexts/sessionContext";
import Image from "next/image";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { session, signIn, signOut, updateNickname } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Error logging out, please try again.");
    }
  };

  return (
    <div className="relative h-screen">
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
        } transition-transform duration-300 ease-in-out z-50 flex flex-col`}
      >
        <nav className="p-4 space-y-4">
          <Link href="/" className="block p-2 rounded hover:bg-gray-700">
            Songs
          </Link>
        </nav>
        <div className="flex-1" />
        <div className="p-4 border-t border-gray-700">
          {session && (
            <button
              onClick={async () => {
                try {
                  if (!session) throw new Error("No active session");
                  const newNickname = prompt(
                    "Enter new nickname (max 20 characters):",
                  );
                  if (!newNickname) return;
                  if (newNickname.length > 20) {
                    alert("Nickname must be 20 characters or less");
                    return;
                  }
                  await updateNickname(newNickname);
                  window.location.reload();
                } catch (error) {
                  console.error("Failed to update nickname:", error);
                  alert("Failed to update nickname. Please try again.");
                }
              }}
              className="w-full p-2 mb-4 bg-blue-600 rounded hover:bg-blue-700"
            >
              Change Nickname
            </button>
          )}
          {session && (
            <div className="mb-4 flex items-center">
              <Image
                src={session.user.user_metadata.avatar_url}
                alt="Profile"
                className="w-10 h-10 rounded-full mr-3"
                width={40}
                height={40}
              />
              <div>
                <p className="text-sm text-gray-300">Logged in as:</p>
                <p className="font-bold">
                  {session.user.user_metadata.nickname || session.user.id}
                </p>
              </div>
            </div>
          )}
          {!session && (
            <button
              onClick={signIn}
              className="w-full p-2 mb-4 bg-white text-gray-800 rounded hover:bg-gray-100 flex items-center justify-center"
            >
              <img
                src="https://authjs.dev/img/providers/google.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Sign in with Google
            </button>
          )}
          {session && (
            <button
              className="w-full p-2 bg-red-600 rounded hover:bg-red-700"
              onClick={handleSignOut}
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <main className="pt-20">{children}</main>
    </div>
  );
}
