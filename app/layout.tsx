import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mini Weihnachts-Quiz",
  description: "Für Mama & Papa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
