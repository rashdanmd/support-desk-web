import type { Metadata } from "next";
import { Inter } from "next/font/google";

import StyledComponentsRegistry from "@/lib/styled-components-registry";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Support Desk",
  description: "Raise, track and resolve support requests.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
