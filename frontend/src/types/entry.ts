export type Mood = "happy" | "sad" | "angry" | "neutral" | "excited";

export interface Entry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: Mood;
  created_at: string;
  updated_at: string;
}

export interface EntryInsert {
  title: string;
  content: string;
  mood: Mood;
  user_id?: string;
}

export interface EntryUpdate {
  title?: string;
  content?: string;
  mood?: Mood;
}
