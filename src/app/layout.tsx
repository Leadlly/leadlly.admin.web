import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Mada } from "next/font/google";

// Configure the font
const mada = Mada({
  subsets: ["latin"], // Choose appropriate subsets
  weight: ["200", "300", "400", "500", "600", "700"], // Pick needed weights
  variable: "--font-mada", // Optional CSS variable name
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
    <html lang="en" suppressHydrationWarning className={mada.variable}>
      <body>
        <div className="p-6 bg-white min-h-screen">
          <div className="max-w-6xl mx-auto">{children}</div>
        </div>
      </body>
    </html>
  );
}
