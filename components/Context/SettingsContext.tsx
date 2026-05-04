"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SettingsContextType {
  arabicFontSize: number;
  setArabicFontSize: (val: number) => void;
  translationFontSize: number;
  setTranslationFontSize: (val: number) => void;
  arabicFontFace: string;
  setArabicFontFace: (val: string) => void;
  isMobileSettingsOpen: boolean;
  setIsMobileSettingsOpen: (val: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [arabicFontSize, setArabicFontSize] = useState(28);
  const [translationFontSize, setTranslationFontSize] = useState(18);
  const [arabicFontFace, setArabicFontFace] = useState("Me Quran");
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);

  return (
    <SettingsContext.Provider
      value={{
        arabicFontSize,
        setArabicFontSize,
        translationFontSize,
        setTranslationFontSize,
        arabicFontFace,
        setArabicFontFace,
        isMobileSettingsOpen,
        setIsMobileSettingsOpen,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
