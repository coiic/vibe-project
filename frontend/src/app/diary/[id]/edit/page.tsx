import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { createClient } from "@/lib/supabase/server";
import { parseMood } from "@/lib/entry-mood";
import type { Entry } from "@/types/entry";
import DiaryEditForm from "./DiaryEditForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DiaryEditPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: row, error } = await supabase
    .from("entries")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !row) {
    notFound();
  }

  const entry = row as Entry;
  const mood = parseMood(entry.mood);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <DiaryEditForm
          entryId={entry.id}
          initialTitle={entry.title}
          initialContent={entry.content}
          initialMood={mood}
        />
      </main>
    </>
  );
}
