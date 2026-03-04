import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio — Software Engineer",
  description: "Software Engineer crafting modern software solutions",
};

//Root layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-warm text-ink antialiased">{children}</body>
    </html>
  );
}
