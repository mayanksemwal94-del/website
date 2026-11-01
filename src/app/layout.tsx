import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mayank Semwal — Official",
  description: "Songs, videos, the Dhaage EP, and the world around Mayank Semwal.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
