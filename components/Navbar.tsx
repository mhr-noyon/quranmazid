"use client";
import React from "react";
import { SearchIcon, ThemeMoonIcon, SettingsGearIcon, SupportHeartIcon } from "./icons";

/* ================= Icon Button ================= */
const IconButton = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => {
  return (
    <div className="relative group flex flex-col items-center">
      <button
        className="
          cursor-pointer
          flex size-[34px] min-w-[34px]
          items-center justify-center
          rounded-full
          bg-[#111510]
          text-[var(--primary-green)]
          transition-all duration-300 ease-out
          hover:scale-105 active:scale-90
          [&>svg]:size-[18px]
        "
      >
        {icon}
      </button>

      <span
        className="
          pointer-events-none
          absolute top-full mt-2
          whitespace-nowrap
          rounded-md
          bg-[var(--primary-white)] text-black text-[12px]
          px-3 py-1
          opacity-0 scale-95
          transition-all duration-200
          group-hover:opacity-100 group-hover:scale-100
        "
      >
        {label}
      </span>
    </div>
  );
};

/* ================= Navbar ================= */
export const Navbar = () => {
  const items = [
    { label: "Search", icon: <SearchIcon /> },
    { label: "Theme", icon: <ThemeMoonIcon /> },
    { label: "Settings", icon: <SettingsGearIcon /> },
  ];

  return (
    <nav
      className="
        sticky top-0 z-50
        flex h-[70px] w-full
        items-center justify-between
        border-b border-zinc-200
        bg-white px-6
        dark:bg-zinc-950 dark:border-zinc-800
      "
    >
      {/* LEFT */}
      <div className="flex items-center">
        <div className="leading-tight">
          <p className="text-lg font-bold text-[var(--primary-white)]">
            Quran Mazid
          </p>
          <p className="text-[10px] text-zinc-500">
            Read, Study, and Learn The Quran
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {items.map((item, i) => (
          <IconButton key={i} label={item.label} icon={item.icon} />
        ))}

        <a
          href="#"
          className="
            cursor-pointer
            flex h-[36px] items-center gap-2
            rounded-full px-4
            bg-[var(--primary-green)]
            text-white text-sm font-medium
            transition-all duration-300
            hover:opacity-90 active:scale-95
          "
        >
          Support Us <SupportHeartIcon />
        </a>
      </div>
    </nav>
  );
};
