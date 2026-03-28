import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import DiaryDeleteButton from "@/components/DiaryDeleteButton";
import { createClient } from "@/lib/supabase/server";
import { parseMood } from "@/lib/entry-mood";
import type { Entry, Mood } from "@/types/entry";

const moodConfig: Record<Mood, { emoji: string; label: string }> = {
  happy: { emoji: "😊", label: "행복" },
  sad: { emoji: "😢", label: "슬픔" },
  angry: { emoji: "😠", label: "화남" },
  neutral: { emoji: "😐", label: "보통" },
  excited: { emoji: "🤩", label: "신남" },
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DiaryDetailPage({ params }: PageProps) {
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
  const mood = moodConfig[parseMood(entry.mood)];
  const isEdited = entry.updated_at !== entry.created_at;

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <Link
          href="/diary"
          className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          목록으로
        </Link>

        <article className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-zinc-900">
                {entry.title}
              </h1>
              <div className="mt-2 flex items-center gap-3 text-sm text-zinc-500">
                <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700">
                  <span className="text-base">{mood.emoji}</span>
                  {mood.label}
                </span>
                <span>{formatDate(entry.created_at)}</span>
              </div>
            </div>
          </div>

          <div className="whitespace-pre-wrap text-base leading-relaxed text-zinc-700">
            {entry.content}
          </div>

          <div className="mt-8 border-t border-zinc-100 pt-4 text-xs text-zinc-400">
            <p>작성일: {formatDateTime(entry.created_at)}</p>
            {isEdited && (
              <p className="mt-0.5">
                수정일: {formatDateTime(entry.updated_at)}
              </p>
            )}
          </div>
        </article>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Link
            href={`/diary/${entry.id}/edit`}
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            수정
          </Link>
          <DiaryDeleteButton entryId={entry.id} />
        </div>
      </main>
    </>
  );
}
