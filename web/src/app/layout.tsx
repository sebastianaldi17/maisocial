"use client";

import "./globals.css";
import { SessionProvider } from "@/contexts/sessionContext";
import MainLayout from "@/components/layouts/mainLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <title>MaiSocial</title>
      <body>
        <SessionProvider>
          <MainLayout>{children}</MainLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
