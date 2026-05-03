"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type SurahIndexItem = {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  total_verses: number;
};

type Verse = {
  id: number;
  text: string;
  translation: string;
};

type Surah = {
  id: number;
  name: string;
  translation: string;
  total_verses: number;
  verses: Verse[];
};

export default function Home() {
  const [surahs, setSurahs] = useState<SurahIndexItem[]>([]);
  const [selectedSurahId, setSelectedSurahId] = useState<number | null>(null);
  const [surah, setSurah] = useState<Surah | null>(null);
  const [startVerse, setStartVerse] = useState<number | null>(null);
  const [audioUrls, setAudioUrls] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const verses = useMemo(() => surah?.verses ?? [], [surah]);
  const currentVerseId = startVerse !== null && currentIndex >= 0
    ? startVerse + currentIndex
    : null;

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
          setError("Failed to load surah list.");
        }
      }
    }

    loadSurahs();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedSurahId) {
      setSurah(null);
      setStartVerse(null);
      setAudioUrls([]);
      setCurrentIndex(-1);
      return;
    }

    let isMounted = true;

    async function loadSurah() {
      setError(null);
      setAudioUrls([]);
      setCurrentIndex(-1);

      try {
        const response = await fetch(`/api/surah?id=${selectedSurahId}`);
        const data = (await response.json()) as Surah;
        if (isMounted) {
          setSurah(data);
          setStartVerse(1);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load surah.");
        }
      }
    }

    loadSurah();
    return () => {
      isMounted = false;
    };
  }, [selectedSurahId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const handleEnded = () => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= audioUrls.length) {
          setIsPlaying(false);
          return prev;
        }
        return nextIndex;
      });
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = () => {
      setAudioError("Audio failed to load. Try another reciter or verse.");
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
    };
  }, [audioUrls.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (currentIndex < 0 || currentIndex >= audioUrls.length) {
      return;
    }

    audio.src = audioUrls[currentIndex];
    audio.currentTime = 0;
    audio.play().catch(() => {
      setIsPlaying(false);
    });
  }, [audioUrls, currentIndex]);

  async function handleLoadAudio() {
    if (!selectedSurahId || !startVerse) {
      return;
    }

    setError(null);
    setAudioError(null);
    setIsPlaying(false);
    setAudioUrls([]);
    setCurrentIndex(-1);

    try {
      const response = await fetch(
        `/api/audio?chapter=${selectedSurahId}&from=${startVerse}`
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data?.error ?? "Failed to load audio.");
        return;
      }

      const urls = Array.isArray(data?.audioUrls) ? data.audioUrls : [];
      if (urls.length === 0) {
        setError("No audio URLs returned.");
        return;
      }

      setAudioUrls(urls);
      setCurrentIndex(0);
    } catch {
      setError("Failed to load audio.");
    }
  }

  function handlePause() {
    audioRef.current?.pause();
  }

  function handleResume() {
    audioRef.current?.play();
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-900">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">Quran Audio Test</h1>
          <p className="text-sm text-zinc-500">
            Select a surah, pick a starting ayah, and play verse-by-verse.
          </p>
        </header>

        <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4">
            <label className="text-sm font-medium">
              Surah
              <select
                className="mt-2 w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm"
                value={selectedSurahId ?? ""}
                onChange={(event) =>
                  setSelectedSurahId(
                    event.target.value ? Number(event.target.value) : null
                  )
                }
              >
                <option value="">Select surah</option>
                {surahs.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.id}. {item.transliteration} - {item.translation}
                  </option>
                ))}
              </select>
            </label>

            {surah && (
              <label className="text-sm font-medium">
                Start ayah (dropdown shows verses)
                <select
                  className="mt-2 w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm"
                  value={startVerse ?? ""}
                  onChange={(event) =>
                    setStartVerse(
                      event.target.value ? Number(event.target.value) : null
                    )
                  }
                >
                  {verses.map((verse) => (
                    <option key={verse.id} value={verse.id}>
                      {verse.id}. {verse.text}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
              onClick={handleLoadAudio}
              disabled={!selectedSurahId || !startVerse}
            >
              Load & Play
            </button>
            <button
              className="rounded border border-zinc-300 px-4 py-2 text-sm"
              onClick={handlePause}
              disabled={!isPlaying}
            >
              Pause
            </button>
            <button
              className="rounded border border-zinc-300 px-4 py-2 text-sm"
              onClick={handleResume}
              disabled={isPlaying || currentIndex < 0}
            >
              Resume
            </button>
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          )}
          {audioError && (
            <p className="mt-2 text-sm text-amber-600">{audioError}</p>
          )}
          {currentIndex >= 0 && audioUrls[currentIndex] && (
            <p className="mt-2 break-all text-xs text-zinc-500">
              Now playing: {audioUrls[currentIndex]}
            </p>
          )}
        </section>

        {surah && (
          <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <h2 className="text-base font-semibold">
              {surah.name} - {surah.translation}
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {verses.map((verse) => {
                const isActive = currentVerseId === verse.id;
                return (
                  <li
                    key={verse.id}
                    className={
                      isActive
                        ? "rounded border border-amber-300 bg-amber-50 px-3 py-2"
                        : "rounded border border-zinc-200 px-3 py-2"
                    }
                  >
                    <div className="font-medium">{verse.id}.</div>
                    <div className="text-lg leading-relaxed">{verse.text}</div>
                    <div className="text-xs text-zinc-500">
                      {verse.translation}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <audio ref={audioRef} preload="auto" />
      </div>
    </div>
  );
}
