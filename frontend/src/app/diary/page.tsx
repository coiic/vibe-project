import Link from "next/link";
import Header from "@/components/Header";
import { createClient } from "@/lib/supabase/server";
import { parseMood } from "@/lib/entry-mood";
import type { Mood } from "@/types/entry";

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

export default async function DiaryListPage() {
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from("entries")
    .select("id, title, mood, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <>
        <Header />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
            <p className="text-lg font-medium text-red-800">
              일기 목록을 불러오지 못했습니다
            </p>
            <p className="mt-2 text-sm text-red-600">{error.message}</p>
            <Link
              href="/diary"
              className="mt-6 inline-block rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
            >
              다시 시도
            </Link>
          </div>
        </main>
      </>
    );
  }

  const entries = rows ?? [];

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900">내 일기</h1>
          <Link
            href="/diary/new"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            새 일기 쓰기
          </Link>
        </div>

        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 py-20 text-center">
            <p className="text-lg font-medium text-zinc-500">
              아직 작성한 일기가 없습니다
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              첫 번째 일기를 작성해 보세요!
            </p>
            <Link
              href="/diary/new"
              className="mt-6 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
            >
              일기 쓰기
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {entries.map((entry) => {
              const mood = moodConfig[parseMood(entry.mood)];
              return (
                <li key={entry.id}>
                  <Link
                    href={`/diary/${entry.id}`}
                    className="group flex items-center gap-4 rounded-xl border border-zinc-200 bg-white px-5 py-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xl">
                      {mood.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-zinc-900 group-hover:text-zinc-700">
                        {entry.title}
                      </p>
                      <p className="mt-0.5 text-sm text-zinc-500">
                        <span>{mood.label}</span>
                        <span className="mx-1.5">·</span>
                        <span>{formatDate(entry.created_at)}</span>
                      </p>
                    </div>
                    <svg
                      className="h-5 w-5 shrink-0 text-zinc-300 transition-colors group-hover:text-zinc-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}
