import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getUser } from "@/actions/user_actions";
import StoreProvider from "./StoreProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Leadlly | Admin",
  description: "Admin dashboard by leadlly",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userData = await getUser();

  return (
    <html lang="en">
      <body>
        <StoreProvider user={userData?.user}>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
          >
            {children}
            <Toaster richColors position="top-center" />
          </GoogleOAuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
