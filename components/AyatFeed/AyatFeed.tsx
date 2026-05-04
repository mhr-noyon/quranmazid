"use client";

import React from "react";
import Image from "next/image";
import { AyatCard } from "./AyatCard";
import { Loader } from "../Shared/Loader";

import { Surah } from "../../types";

interface AyatFeedProps {
  surah: Surah | null;
  onNextSurah?: () => void;
  onPrevSurah?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export const AyatFeed = ({ surah, onNextSurah, onPrevSurah, hasNext, hasPrev }: AyatFeedProps) => {
  if (!surah) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full text-zinc-500 gap-4 bg-[var(--primary-black)]">
        <Loader size="lg" color="green" />
        <p>Loading Surah...</p>
      </div>
    );
  }

  console.log('surah inside ayatFeed->>>',surah);

  const showBismillah = surah.id !== 9;

  return (
    <div className="flex-1 h-full overflow-y-auto pb-[50] bg-black">
      {/* Surah Header */}
      <div className="flex flex-col px-4 md:px-10  md:flex-row items-center md:items-start justify-between py-10 md:py-8 border-b border-zinc-200 dark:border-zinc-800/50 md:gap-20">
        {/* Mobile view */}
        <div className="flex flex-col  items-center gap-4 md:hidden w-full">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{surah.transliteration}</h1>
          <p className="text-sm text-zinc-500">
            Ayah-{surah.total_verses}, Madinah
          </p>
          <div className="mt-6 w-48 h-12 relative opacity-80 dark:opacity-60 dark:invert">
            <Image
              src="/bismillah.svg"
              alt="Bismillah"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Desktop view */}
        <div className="hidden md:block w-20 h-20 relative rounded-xl overflow-hidden opacity-100 flex items-center justify-center flex-1">
            <Image
              src="/mosque.png"
              alt="Madinah"
              fill
              sizes="16px"
              className="object-cover"
            />
          </div>
        <div className="hidden md:flex items-center justify-center gap-6 flex-1">
          <div className="flex flex-col items-center justify-center md:gap-[10px]">
            <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-[var(--primary-white)]">
              {surah.transliteration}
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Ayah-{surah.total_verses}, Madinah
            </p>
          </div>
        </div>

        <div className={`
            hidden md:block w-48 h-16 relative flex-1
            opacity-80 dark:opacity-60 dark:invert
            ${surah.id === 1 ? "md:invisible" : ""}
          `}>
            <Image
            src="/bismillah.svg"
            alt="Surah Calligraphy"
            fill
            className="object-contain object-right"
          />
        </div>
      </div>

      {/* Ayat List */}
      <div className="flex flex-col ">
        {surah.verses.map((verse) => (
          <AyatCard key={verse.id} surahId={surah.id} verse={verse} />
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center  rounded-full  max-w-[230px] m-auto bg-[var(--primary-gray)] justify-center gap-8 mt-14 py-2 px-2">
        <button
          onClick={onPrevSurah}
          disabled={!hasPrev}
          className={`flex items-center text-base gap-1 font-medium transition-all ${
            hasPrev
              ? "cursor-pointer text-[var(--primary-white)]"
              : "text-zinc-400 dark:text-zinc-700 cursor-default"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <button
          onClick={onNextSurah}
          disabled={!hasNext}
          className={`flex items-center gap-1 text-base font-medium transition-all ${
            hasNext
              ? "cursor-pointer text-[var(--primary-white)]"
              : "text-zinc-400 dark:text-zinc-700 cursor-not-allowed"
          }`}
        >
          Next
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};
