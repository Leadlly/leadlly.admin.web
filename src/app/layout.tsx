import type { Metadata } from "next";
import { Mada as FontSans } from "next/font/google";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";

import { cn } from "@/lib/utils";

import "./globals.css";

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Leadlly | Admin",
  description: "Admin dashboard by leadlly",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "font-sans antialiased custom__scrollbar",
          fontSans.variable
        )}
      >
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          {children}
          <Toaster richColors position="top-center" />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
