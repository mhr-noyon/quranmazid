"use client";
import Link from "next/link";
import React from "react";
import { LogoIcon, HomeIcon, DashboardIcon, ExploreIcon, BookmarkIcon, MenuIcon } from "./icons";

/* ================= Button ================= */
const ShowButton = ({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) => {
  return (
    <button
      className={`
        group
        flex size-6 items-center justify-center rounded-xl
        cursor-pointer
        transition-all duration-300 ease-out
        [&_svg]:size-[24px]

        ${
          active
            ? "text-[var(--primary-ash)_500] border-[var(--primary-ash)_500] bg-[var(--primary-ash)/50]"
            : "text-zinc-400 border-transparent hover:text-[var(--primary-ash)] hover:border-zinc-200 dark:hover:border-zinc-7-00"
        }
      `}
    >
      {children}
    </button>
  );
};

/* ================= Sidebar ================= */
export const Sidebar = () => {
  return (
    <aside className="fixed left-0 z-50 flex bg-white border-zinc-100 dark:border-zinc-800 dark:bg-[#171717]
      max-md:bottom-0 max-md:h-16 max-md:w-full max-md:border-t
      md:top-0 md:h-screen md:w-16 md:flex-col md:border-r">

      <div className="flex h-full w-full items-center max-md:flex-row max-md:justify-evenly md:flex-col md:justify-center relative">
        <div className="hidden md:flex absolute top-0 py-4 w-full justify-center">
          <Link href="/"><LogoIcon /></Link>
        </div>

        <nav className="flex items-center md:flex-col md:gap-8 max-md:gap-10">
            <div className="flex items-center gap-2.5 max-md:hidden">
          <Link href="/" className="cursor-pointer"><ShowButton><HomeIcon/></ShowButton></Link>
          </div>
          <Link href="/1"><ShowButton><DashboardIcon /></ShowButton></Link>
          <ShowButton><ExploreIcon /></ShowButton>
          <Link href="/profile/bookmarks"><ShowButton><BookmarkIcon /></ShowButton></Link>
          <ShowButton><MenuIcon /></ShowButton>
        </nav>
      </div>
    </aside>
  );
};
