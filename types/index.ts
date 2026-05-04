export interface Verse {
  id: number;
  text: string;
  translation: string;
}

export interface Surah {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  total_verses: number;
  verses: Verse[];
}

export type SurahIndexItem = {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  total_verses: number;
};
