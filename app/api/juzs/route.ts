import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.quran.com/api/v4/juzs", {
      next: { revalidate: 86400 } // Cache for 24 hours
    });
    const data = await response.json();
    
    console.log(data);
    // Deduplicate on the server side
    const uniqueJuzs = [];
    const seen = new Set();
    if (data.juzs) {
      for (const j of data.juzs) {
        if (!seen.has(j.juz_number)) {
          seen.add(j.juz_number);
          uniqueJuzs.push(j);
        }
      }
    }
    
    return NextResponse.json({ juzs: uniqueJuzs });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch juz list" }, { status: 500 });
  }
}
