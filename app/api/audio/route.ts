import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const RECITERS_URL =
  "https://api.quran.com/api/v4/resources/recitations";

const RECITATION_URL =
  "https://api.quran.com/api/v4/quran/recitations";

const AUDIO_BASE_URL = "https://verses.quran.com/";
const SURAH_DIR = path.join(process.cwd(), "data", "surahs");

type Reciter = {
  id: number;
  reciter_name: string;
  style: string | null;
};

type AudioFile = {
  verse_key: string;
  url: string;
};

async function getReciters(): Promise<Reciter[]> {
  const res = await fetch(RECITERS_URL);
  if (!res.ok) throw new Error("Failed to fetch reciters");

  const data = await res.json();
  return Array.isArray(data?.recitations) ? data.recitations : [];
}

async function getAudioFiles(reciterId: number, chapter: number) {
  const res = await fetch(
    `${RECITATION_URL}/${reciterId}?chapter_number=${chapter}`
  );

  if (!res.ok) throw new Error("Failed to fetch audio files");

  const data = await res.json();
  return Array.isArray(data?.audio_files) ? data.audio_files : [];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const chapter = Number(searchParams.get("chapter"));
  const from = Number(searchParams.get("from"));

  if (!Number.isInteger(chapter) || chapter < 1 || chapter > 114) {
    return NextResponse.json(
      { error: "Invalid chapter (1-114 required)" },
      { status: 400 }
    );
  }

  if (!Number.isInteger(from) || from < 1) {
    return NextResponse.json(
      { error: "Invalid from (must be >= 1)" },
      { status: 400 }
    );
  }

  let reciters: Reciter[] = [];

  try {
    reciters = await getReciters();
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch reciters" },
      { status: 502 }
    );
  }

  const picked = reciters[0];

  let audioFiles: AudioFile[] = [];

  try {
    audioFiles = await getAudioFiles(picked.id, chapter);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch recitation" },
      { status: 502 }
    );
  }

  const surahPath = path.join(SURAH_DIR, `${chapter}.json`); 
  const surah = JSON.parse(await fs.readFile(surahPath, "utf8"));
  const maxVerse = surah.total_verses;

  const start = from;
  const end = maxVerse;

  if (start > end) {
    return NextResponse.json(
      { error: "Invalid range" },
      { status: 400 }
    );
  }

  const audioUrls: string[] = [];

  for (let v = start; v <= end; v++) {
    const verseKey = `${chapter}:${v}`;
    const file = audioFiles.find((a) => a.verse_key === verseKey);

    if (file?.url) {
      audioUrls.push(`${AUDIO_BASE_URL}${file.url}`);
    }
  }

  return NextResponse.json({
    reciter: {
      id: picked.id,
      name: picked.reciter_name,
      style: picked.style,
    },
    range: {
      chapter,
      from: start,
      to: end,
    },
    audioUrls,
  });
}