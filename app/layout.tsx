import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Semantic Zoom Reading",
  description: "Read a scientific paper at any depth — from a plain-language skeleton to the original with an AI assist layer.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
