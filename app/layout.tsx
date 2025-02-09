import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import Footer from "@/components/navigation/footer";
import Header from "@/components/navigation/header";

import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Project Management",
  description: "A project management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="">
        <Providers>
          <SessionProvider>
            <Header />
            <main>
              <div className="container py-5" style={{ minHeight: "calc(100vh - 175px)" }}>
                <Providers>{children}</Providers>
              </div>
            </main>
            <Footer />
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
