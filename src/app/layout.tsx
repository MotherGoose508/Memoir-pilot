import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "memoir · Learn better",
  description: "A personal, focused way to learn your study sets.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
