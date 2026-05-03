import { Inter } from "next/font/google";
import "./globals.css";   
import { AppShell } from "@/components/AppShell";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Quran Mazid",
  description: "Read, Study, and Learn The Quran",
  icons: {
    icon: "./logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}