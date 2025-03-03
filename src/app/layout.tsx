import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Inter } from "next/font/google";
import { BatchesProvider } from "@/providers/BatchesProvider";
import { StudentsProvider } from "@/providers/StudentsProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Leadlly | Admin",
  description: "Admin dashboard by leadlly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className={`font-sans antialiased`}>
        <BatchesProvider>
          <StudentsProvider>{children}</StudentsProvider>
        </BatchesProvider>
      </body>
    </html>
  );
}
