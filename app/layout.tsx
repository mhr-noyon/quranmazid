import { Inter } from "next/font/google";
import "./globals.css"; // Ensure your Tailwind CSS file is imported here
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { LogoIcon } from "@/components/icons";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Quran Mazid",
  description: "Read, Study, and Learn The Quran",
  icons: {
    icon: "./logo.svg", // Path to your logo file
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
        <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-900">
          {/* Fixed Side Navigation */}
          <Sidebar />
          
          {/* Main Content Viewport */}
          <div className="flex flex-1 flex-col md:pl-16"> 
            {/* Navbar sits at the top of the content area */}
            <Navbar />
            
            <main className="p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}