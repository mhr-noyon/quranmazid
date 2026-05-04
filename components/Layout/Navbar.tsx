"use client";
import React from "react";
import { SearchIcon, ThemeMoonIcon, SettingsGearIcon, SupportHeartIcon } from "../Shared/icons";
import { TextAlignJustify, X } from "lucide-react";
import { useSettings } from "../Context/SettingsContext";


/* ================= Icon Button ================= */
const IconButton = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) => {
  return (
    <div className="relative group flex flex-col items-center">
      <button
        onClick={onClick}
        className="
          cursor-pointer
          flex size-[34px] min-w-[34px]
          items-center justify-center
          rounded-full
          bg-[var(--primary-black)]
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
export const Navbar = ({
  onMenuClick,
  isDrawerOpen,
}: {
  onMenuClick?: () => void;
  isDrawerOpen?: boolean;
}) => {
  const { isMobileSettingsOpen, setIsMobileSettingsOpen } = useSettings();

  const items = [
    { label: "Search", icon: <SearchIcon />, onClick: () => {} },
    { label: "Theme", icon: <ThemeMoonIcon />, onClick: () => {} },
    { 
      label: "Settings", 
      icon: <SettingsGearIcon />, 
      onClick: () => {
        setIsMobileSettingsOpen(true);
      } 
    },
  ];

  return (
    <nav
      className="
        sticky top-0 z-50
        flex h-[60px] w-full
        items-center justify-between
        border-b border-zinc-200
        bg-white px-6
        dark:bg-zinc-950 dark:border-zinc-800
        px-6 py-2
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="relative z-50 flex items-center justify-center rounded-full border border-zinc-200 p-2 text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-200 md:hidden"
          aria-label="Toggle surah drawer"
        >
          {isDrawerOpen ? <X size={18} /> : <TextAlignJustify size={18} />}
        </button>
        <div className="leading-tight">
          <p className="text-base font-bold md:text-lg text-[var(--primary-white)]">
            Quran Mazid
          </p>
          <p className="text-[10px] text-zinc-500 max-md:hidden">
            Read, Study, and Learn The Quran
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {items.map((item, i) => (
          <IconButton key={i} label={item.label} icon={item.icon} onClick={item.onClick} />
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
            max-md:hidden
          "
        >
          Support Us <SupportHeartIcon />
        </a>
      </div>
    </nav>
  );
};
