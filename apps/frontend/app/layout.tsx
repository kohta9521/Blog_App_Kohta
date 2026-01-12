// next
import type { Metadata } from "next";
import { IBM_Plex_Sans_JP, IBM_Plex_Mono } from "next/font/google";

// styles
import "@/styles/globals.css";

const ibmPlexSansJP = IBM_Plex_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-ibm-plex-sans-jp",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kohta Tech Blog / 光太テックブログ",
  description: "日々の勉強内容を発信・備忘録をまとめたテック中心のブログです",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${ibmPlexSansJP.variable} ${ibmPlexMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
