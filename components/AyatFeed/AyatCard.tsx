"use client";

import React, { useRef, useEffect } from "react";
import { Play, Pause, BookOpen, Bookmark, MoreVertical } from "lucide-react";
import { useSettings } from "../Context/SettingsContext";
import { useAudio } from "../AudioPlayer/AudioContext";

import { Verse } from "../../types";

interface AyatCardProps {
  surahId: number;
  verse: Verse;
}

const toArabicNumber = (num: number) => 
  num.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d as any]);

export const AyatCard = ({ surahId, verse }: AyatCardProps) => {
  const { arabicFontSize, translationFontSize, arabicFontFace } = useSettings();
  const { currentVerseId, isPlaying, playVerse, pause, resume } = useAudio();
  
  const isCurrentPlaying = currentVerseId === verse.id;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCurrentPlaying && containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isCurrentPlaying]);

  const handlePlayClick = () => {
    if (isCurrentPlaying) {
      if (isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      playVerse(surahId, verse.id);
    }
  };

  const getFontFamily = () => {
    if (arabicFontFace.startsWith("var(")) {
      return arabicFontFace;
    }
    return `"${arabicFontFace}", serif, var(--font-amiri-quran)`;
  };

  const IconButton = ({ icon: Icon, tooltip, onClick }: any) => (
    <div className="relative group flex items-center justify-center">
      <button
        onClick={onClick}
        className="cursor-pointer p-2 text-zinc-500 transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
      >
        <Icon size={20} />
      </button>
      <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-md bg-[var(--primary-white)] text-black text-[12px] px-2 py-1 opacity-0 scale-95 transition-all group-hover:opacity-100 group-hover:scale-100 z-10 hidden md:block">
        {tooltip}
      </span>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`flex flex-col md:flex-row gap-4 border md:gap-6 px-4 md:px-6 p-4 md:pt-6 border-b border-zinc-200 dark:border-zinc-800/50 transition-colors scroll-mt-24 ${
        isCurrentPlaying ? "bg-[var(--primary-green)]/15 dark:bg-[var(--primary-green)]/15 rounded-xl" : ""
      }`}
    >
      {/* Mobile Top */}
      <div className="flex md:hidden items-center justify-between w-full">
        <span className="font-semibold text-[var(--primary-green)]">
          {surahId}:{verse.id}
        </span>
        <button className="p-2 text-zinc-500 hover:text-[var(--primary-green)]">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Desktop Left Column */}
      <div className="hidden md:flex flex-col items-center gap-4 w-[50px] shrink-0">
        <span className="font-semibold text-[var(--primary-green)]">
          {surahId}:{verse.id}
        </span>
        <div className="flex flex-col gap-2">
          <IconButton
            icon={isCurrentPlaying && isPlaying ? Pause : Play}
            tooltip="Play"
            onClick={handlePlayClick}
          />
          <IconButton icon={BookOpen} tooltip="Tafsir" />
          <IconButton icon={Bookmark} tooltip="Bookmark" />
          <IconButton icon={MoreVertical} tooltip="More" />
        </div>
      </div>

      {/* Right Column - Arabic & Translation */}
      <div className="flex-1 flex flex-col gap-6 pt-8 md:pt-12">
        <div
          dir="rtl"
          style={{
            fontSize: `${arabicFontSize}px`,
            fontFamily: getFontFamily(),
            lineHeight: "1.8",
          }}
          className={`text-right ${
            isCurrentPlaying ? "text-[var(--primary-green)]" : "text-[var(--primary-white)] dark:text-[var(--primary-white)]"
          } transition-colors duration-300`}
        >
          {verse.text}
          <span className="inline-flex items-center justify-center relative mx-2">
            <span className="text-[0.4em] absolute">{toArabicNumber(verse.id)}</span>
            <span className="text-[0.8em]">۝</span>
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[10px] md:text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            SAHEEH INTERNATIONAL
          </span>
          <div
            style={{ fontSize: `${translationFontSize}px`, lineHeight: "1.6" }}
            className="text-[var(--primary-white)] dark:text-[var(--primary-white)]"
          >
            {verse.translation}
          </div>
        </div>
        
        <div className="flex md:hidden gap-4 mt-2">
            <button onClick={handlePlayClick} className="flex items-center gap-2 text-sm text-[var(--primary-green)] font-medium">
               {isCurrentPlaying && isPlaying ? <Pause size={16}/> : <Play size={16}/>} 
               {isCurrentPlaying && isPlaying ? "Pause" : "Play"}
            </button>
        </div>
      </div>
    </div>
  );
};
