"use client";

import { Activity, useEffect, useState } from "react";
import { Sidebar } from "../Layout/Sidebar";
import { Navbar } from "../Layout/Navbar";
import { SurahDrawer } from "../SidePanel/SurahDrawer";
import { AyatFeed } from "../AyatFeed/AyatFeed";
import { RightPanel } from "../SidePanel/RightPanel";
import { AudioPlayer } from "../AudioPlayer/AudioPlayer";
import { useAudio } from "../AudioPlayer/AudioContext";

import { Surah, SurahIndexItem } from "../../types";


export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [surahsList, setSurahsList] = useState<SurahIndexItem[]>([]);
  const [activeSurahInfo, setActiveSurahInfo] = useState<SurahIndexItem | null>(null);
  const [surah, setSurah] = useState<Surah | null>(null);
  const { stop } = useAudio();
  
  useEffect(()=>{
    console.log("useeffet from appshell: ", activeSurahInfo)
    if (!activeSurahInfo?.id) {
      setSurah(null);
      return;
    }

    let isMounted = true;

    async function loadSurah() {
      setSurah(null);
      try {
        const response = await fetch(`/api/surah?id=${activeSurahInfo?.id}`);
        const data = (await response.json()) as Surah;
        console.log("Data->>>", data);
        if (isMounted) {
          const newSurah = {
            ...data,
            transliteration: activeSurahInfo?.transliteration,
          } as Surah;
          console.log("newSurah->>>>", newSurah)
          setSurah(newSurah);
        }
      } catch {
        if (isMounted) {
          setSurah(null);
        }
      }
    }

    loadSurah();
    return () => {
      isMounted = false;
    };
  }, [activeSurahInfo])

  useEffect(()=>{
    if(activeSurahInfo?.id){
      return;
    }

    let isMounted = true;

    async function loadInitialSurah() {
      try {
        const response = await fetch(`/api/surah`);
        const data = (await response.json()) as SurahIndexItem[];
        if (isMounted && data.length > 0) {
          setSurahsList(data);
          setActiveSurahInfo(data[0]);
        } 
      } catch {
        if (isMounted) {
          setActiveSurahInfo(null);
        }
      }
    }

    loadInitialSurah();
    return () => {
      isMounted = false;
    };
  }, [])

  console.log('Active Surah->>>>',activeSurahInfo);
  console.log('surah->>>',surah);

  const handleNextSurah = () => {
    if (!activeSurahInfo || surahsList.length === 0) return;
    const currentIndex = surahsList.findIndex(s => s.id === activeSurahInfo.id);
    if (currentIndex >= 0 && currentIndex < surahsList.length - 1) {
      stop();
      setActiveSurahInfo(surahsList[currentIndex + 1]);
    }
  };

  const handlePrevSurah = () => {
    if (!activeSurahInfo || surahsList.length === 0) return;
    const currentIndex = surahsList.findIndex(s => s.id === activeSurahInfo.id);
    if (currentIndex > 0) {
      stop();
      setActiveSurahInfo(surahsList[currentIndex - 1]);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-900">
      <Sidebar/>
      <div className="flex h-screen flex-1 flex-col pb-16 md:pb-0 md:pl-15">
        <Navbar
          onMenuClick={() => setIsDrawerOpen((prev) => !prev)}
          isDrawerOpen={isDrawerOpen}
        />        
        <div className="flex flex-1 overflow-hidden relative">
            <SurahDrawer 
              activeSurahInfo={activeSurahInfo} 
              isOpen={isDrawerOpen} 
              onClose={() => setIsDrawerOpen(false)} 
              onSurahSelect={(surahInfo) => {
                stop();
                setActiveSurahInfo(surahInfo);
              }}
            />
            <AyatFeed 
              surah={surah} 
              onNextSurah={handleNextSurah} 
              onPrevSurah={handlePrevSurah}
              hasNext={activeSurahInfo ? surahsList.findIndex(s => s.id === activeSurahInfo.id) < surahsList.length - 1 : false}
              hasPrev={activeSurahInfo ? surahsList.findIndex(s => s.id === activeSurahInfo.id) > 0 : false}
            />
            <RightPanel />
        </div>
        <AudioPlayer />
      </div>
    </div>
  );
};
