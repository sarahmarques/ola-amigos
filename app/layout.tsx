import type { Metadata, Viewport } from "next";
import { Andika } from "next/font/google";
import "./globals.css";

// Andika is designed for early readers (single-storey "a", clear letter shapes).
const andika = Andika({
  variable: "--font-andika",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Olá Amigos",
  description:
    "Learn European (Portugal) Portuguese through play — for English-speaking children aged 3 to 7.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#a8d8b0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // English is the language of instruction; Portuguese words are tagged lang="pt-PT" where they appear.
  return (
    <html lang="en">
      <body className={`${andika.variable} antialiased`}>{children}</body>
    </html>
  );
}
