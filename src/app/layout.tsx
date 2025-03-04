import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Mada } from "next/font/google"; 

export const metadata: Metadata = {
  title: "Leadlly | Admin",
  description: "Admin dashboard by leadlly",
};
const mada = Mada({ subsets: ["latin"], weight: ["400", "700"] }); // Load Mada font

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={mada.className}>
        {children}
      </body>
    </html>
  );
}
