import type { Mood } from "@/types/entry";

const MOODS: Mood[] = ["happy", "sad", "angry", "neutral", "excited"];

export function parseMood(value: string): Mood {
  return MOODS.includes(value as Mood) ? (value as Mood) : "neutral";
}
