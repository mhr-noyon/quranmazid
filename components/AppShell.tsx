"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { SurahDrawer } from "@/components/SurahDrawer";

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col md:pl-16">
        <Navbar
          onMenuClick={() => setIsDrawerOpen((prev) => !prev)}
          isDrawerOpen={isDrawerOpen}
        />        
        <div className="flex">
            <SurahDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
            <main className="flex-1 p-6 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
};
