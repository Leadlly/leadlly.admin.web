import type { Metadata } from "next";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";

import "./globals.css";

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
      <body>
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
