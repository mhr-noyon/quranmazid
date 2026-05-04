"use client";

import React, { useState } from "react";
import { useSettings } from "../Context/SettingsContext";
import { X, ChevronDown, ChevronUp, BookOpenText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const RightPanel = () => {
  const {
    arabicFontSize,
    setArabicFontSize,
    translationFontSize,
    setTranslationFontSize,
    arabicFontFace,
    setArabicFontFace,
    isMobileSettingsOpen,
    setIsMobileSettingsOpen,
  } = useSettings();

  const [activeTab, setActiveTab] = useState<"Translation" | "Reading">("Translation");

  const [isFontSettingsOpen, setIsFontSettingsOpen] = useState(true);

  // Tab switching animation
  const slideVariants = {
    hidden: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      transition: { duration: 0.2 },
    }),
  };

  const [direction, setDirection] = useState(0);

  const handleTabChange = (tab: "Translation" | "Reading") => {
    if (tab === activeTab) return;
    setDirection(tab === "Reading" ? 1 : -1);
    setActiveTab(tab);
  };

  const PanelContent = (
    <div className="flex flex-col h-full bg-zinc-950 border-l border-zinc-800 w-full max-w-sm ml-auto">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 md:hidden">
        <h2 className="text-white font-semibold">Settings</h2>
        <button
          onClick={() => setIsMobileSettingsOpen(false)}
          className="p-2 text-zinc-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="p-4 pb-0 flex gap-2">
        <button
          onClick={() => handleTabChange("Translation")}
          className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${
            activeTab === "Translation"
              ? "bg-zinc-800 text-white"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Translation
        </button>
        <button
          onClick={() => handleTabChange("Reading")}
          className={`flex-1 py-2 text-sm font-medium rounded-full transition-colors ${
            activeTab === "Reading"
              ? "bg-zinc-800 text-white"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Reading
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 relative hide-scrollbar">
        <AnimatePresence mode="wait" custom={direction}>
          {activeTab === "Translation" && (
            <motion.div
              key="Translation"
              custom={direction}
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-6"
            >
              {/* Reading Settings Demo */}
              <div className="flex flex-col gap-4">
                <button className="flex items-center justify-between text-sm text-zinc-300">
                  <div className="flex items-center gap-2">
                    <BookOpenText className="text-[var(--primary-green)] w-5 h-5"/> Reading Settings
                  </div>
                  {isFontSettingsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {/* Demo Selectors */}
                <div className="flex flex-col gap-3 pl-6 border-l border-zinc-800 ml-2">
                  <div className="flex flex-col gap-1 text-xs">
                    <label className="text-zinc-500">Translations</label>
                    <select className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded p-1 outline-none">
                      <option>Saheeh International</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 text-xs">
                    <label className="text-zinc-500">Word-by-word translations</label>
                    <select className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded p-1 outline-none">
                      <option>Bengali</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Show by words</span>
                    <div className="w-8 h-4 bg-zinc-800 rounded-full flex items-center p-[2px] cursor-pointer">
                      <div className="w-3 h-3 bg-zinc-500 rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Tajweed</span>
                    <div className="w-8 h-4 bg-zinc-800 rounded-full flex items-center p-[2px] cursor-pointer">
                      <div className="w-3 h-3 bg-zinc-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Font Settings */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setIsFontSettingsOpen(!isFontSettingsOpen)}
                  className="flex items-center justify-between text-sm text-[var(--primary-green)]"
                >
                  <div className="flex items-center gap-2">
                    <span className="opacity-90 font-bold">T</span> Font Settings
                  </div>
                  {isFontSettingsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {isFontSettingsOpen && (
                  <div className="flex flex-col gap-6 pl-2">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-300 text-xs">Arabic Font Size</span>
                        <span className="text-[var(--primary-green)] font-mono text-xs">{arabicFontSize}</span>
                      </div>
                      <input
                        type="range"
                        min="18"
                        max="100"
                        value={arabicFontSize}
                        onChange={(e) => setArabicFontSize(Number(e.target.value))}
                        className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[var(--primary-green)]"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-300 text-xs">Translation Font Size</span>
                        <span className="text-[var(--primary-green)] font-mono text-xs">{translationFontSize}</span>
                      </div>
                      <input
                        type="range"
                        min="14"
                        max="44"
                        value={translationFontSize}
                        onChange={(e) => setTranslationFontSize(Number(e.target.value))}
                        className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[var(--primary-green)]"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <span className="text-zinc-300 text-xs">Arabic Font Face</span>
                      <select
                        value={arabicFontFace}
                        onChange={(e) => setArabicFontFace(e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded p-2 text-sm outline-none w-full appearance-none"
                      >
                        <option value="var(--font-amiri-quran)">Amiri Quran</option>
                        <option value="KFGQ">KFGQ</option>
                        <option value="PDMS-Islamic">PDMS Islamic</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Dummy Support Box */}
              <div className="mt-4 p-4 bg-zinc-900 rounded-xl border border-zinc-800/50 flex flex-col gap-3">
                <h3 className="text-[var(--primary-white)] font-medium text-sm md:text-base">Help spread the knowledge of Islam</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Your regular support helps us reach our religious brothers and sisters with the message of Islam. Join our mission and be part of the big change.
                </p>
                <button className="w-full py-2 bg-[var(--primary-green)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
                  Support Us
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "Reading" && (
            <motion.div
              key="Reading"
              custom={direction}
              variants={slideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-4 text-center mt-10"
            >
              <p className="text-zinc-500 text-sm">Reading Mode Settings</p>
              <p className="text-xs text-zinc-600">Additional options will appear here.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block w-80 h-full shrink-0">
        <div className="h-full">
          {PanelContent}
        </div>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileSettingsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSettingsOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-80 max-w-[85vw] h-full z-50 md:hidden"
            >
              {PanelContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
