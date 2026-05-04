"use client";

import { useEffect, useMemo, useState } from "react";
import { LogoIcon, SearchIcon } from "../Shared/icons";
import { X } from "lucide-react";

import { SurahIndexItem } from "../../types";

type TabKey = "surah" | "juz" | "page";

export const SurahDrawer = ({
  activeSurahInfo,
  isOpen,
  onClose,
  onSurahSelect,
}: {
  activeSurahInfo: SurahIndexItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSurahSelect?: (surah: SurahIndexItem) => void;
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>("surah");
  const [surahs, setSurahs] = useState<SurahIndexItem[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadSurahs() {
      try {
        const response = await fetch("/api/surah");
        const data = (await response.json()) as SurahIndexItem[];
        if (isMounted) {
          setSurahs(data);
        }
      } catch {
        if (isMounted) {
          setSurahs([]);
        }
      }
        console.log("useeffet from drawer: ", activeSurahInfo)
    }

    loadSurahs();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredSurahs = useMemo(() => {
    const trimmed = query.trim();

    if (!trimmed) return surahs;

    const lower = trimmed.toLowerCase();

    return surahs.filter((surah) => {
        return (
        surah.transliteration.toLowerCase().includes(lower) ||
        surah.translation.toLowerCase().includes(lower) ||
        surah.name.toLowerCase().includes(lower) ||
        surah.id.toString().includes(lower)
        );
    });
    }, [query, surahs]);

  const tabs: Array<{ key: TabKey; label: string; }> = [
    { key: "surah", label: "Surah"},
    { key: "juz", label: "Juz" },
    { key: "page", label: "Page"},
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
    
      <aside
        className={`fixed left-0 top-0 z-60 flex h-full w-[320px] flex-col border-r border-zinc-200 bg-white shadow-xl transition-transform dark:border-zinc-800 dark:bg-zinc-950 md:static md:z-10 md:translate-x-0 md:shadow-none ${
          isOpen ? "translate-x-0 max-md:w-full" : "-translate-x-full"
        } md:flex`}
      >
        <div className="md:hidden flex items-start justify-between gap-3 max-md:px-4 max-md:py-4">
          <div className="flex gap-3">
            <img src="/logo.svg" alt="Logo" className="size-7 mt-2" />
            <div className="leading-tight">
              <p className="text-xl font-extrabold text-[var(--primary-white)]">
                Quran Mazid
              </p>
              <p className="text-[10px] text-zinc-500">
                Read, Study, and Learn The Quran
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-1 flex items-center justify-center rounded-full border border-zinc-200 p-2 text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-200"
            aria-label="Close surah drawer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex flex-col gap-4 px-4 py-5 ">
          <div className="flex rounded-full bg-zinc-100 p-1 text-sm font-medium text-zinc-500 dark:bg-zinc-900">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`cursor-pointer flex-1 rounded-full px-3 py-1.5 transition ${
                  activeTab === tab.key
                    ? "bg-white/20 text-zinc-900 shadow-sm dark:bg-black/70 dark:text-white"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Surah List */}
        {activeTab === "surah" && (
            <div className="flex flex-1 flex-col gap-4 px-4 overflow-hidden">
          <label className="relative shrink-0">
            <div className="flex flex-row items-center gap-2 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"> 
                <img src="/searchAsh.svg" alt="search" className="size-5" />
                <span className="sr-only text-zinc-400/5">Search Surah</span>
            </div>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Surah"
              className="w-full rounded-full border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm text-zinc-700 outline-none transition focus:border-emerald-600 dark:border-zinc-800 dark:bg-[#171717] dark:text-zinc-200"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <SearchIcon />
            </span>
          </label>

            <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
                <div className="space-y-3">
                {filteredSurahs.map((surah) => {
                    const isActive = surah.id === activeSurahInfo?.id;

                    return (
                    <button
                        key={surah.id}
                        type="button"
                        onClick={() => {
                          if(onSurahSelect) onSurahSelect(surah);
                          onClose();
                        }}
                        className={`cursor-pointer group flex w-full items-center justify-between gap-4 rounded-2xl border px-4 py-5 text-left transition hover:bg-[#111510] transition-all duration-200  ${
                        isActive
                            ? "border-[var(--primary-green)]/20 bg-[#111510] text-zinc-900 dark:text-zinc-100"
                            : "border-zinc-200 dark:border-zinc-800 hover:border-[var(--primary-green)]/20"
                        }`}>
                        <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 rotate-45 items-center justify-center rounded-lg  bg-[#171717] text-xs font-semibold text-white active:bg-[var(--primary-green)] group-hover:bg-[var(--primary-green)] ${isActive ? "bg-[var(--primary-green)]" : ""}`}>
                            <span className="-rotate-45">
                            {surah.id}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-zinc-900 pb-2 dark:text-[var(--primary-white)]">
                            {surah.transliteration}
                            </p>
                            <p className="text-xs text-zinc-500">{surah.translation}</p>
                        </div>
                        </div>
                        <div className="text-right text-base text-zinc-900 dark:text-[var(--primary-white)] font-[var(--font-calligraphy)]">
                        {surah.name}
                        </div>
                    </button>
                    );
                })}
                </div>
            </div>
            </div>
            </div>
        )}

        {activeTab === "juz" && (
            <div className="flex items-center justify-center h-full text-zinc-500">
                Juz list
            </div>
        )}
        {activeTab === "page" && (
            <div className="flex items-center justify-center h-full text-zinc-500">
                Page list
            </div>
        )}
      </aside>
    </>
  );
};
