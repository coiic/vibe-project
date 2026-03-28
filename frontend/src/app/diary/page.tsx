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

type PageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

function normalizeSearchQuery(raw: string | string[] | undefined): string {
  if (raw === undefined) return "";
  const s = Array.isArray(raw) ? (raw[0] ?? "") : raw;
  return s.trim();
}

/** Escape `%`, `_`, and `\` for PostgreSQL ILIKE patterns. */
function escapeIlikePattern(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_");
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function DiaryListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const searchQuery = normalizeSearchQuery(params.q);

  const supabase = await createClient();
  let listQuery = supabase
    .from("entries")
    .select("id, title, mood, created_at")
    .order("created_at", { ascending: false });

  if (searchQuery) {
    const pattern = `%${escapeIlikePattern(searchQuery)}%`;
    listQuery = listQuery.ilike("title", pattern);
  }

  const { data: rows, error } = await listQuery;

  if (error) {
    return (
      <>
        <Header />
        <main className="mx-auto w-full max-w-4xl flex-1 rounded-[2rem] border border-slate-100/50 bg-[#f2f4f7] px-5 py-8 shadow-sm sm:px-8 sm:py-10">
          <div className="rounded-[1.5rem] border border-red-100 bg-white px-6 py-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-red-800">
              일기 목록을 불러오지 못했습니다
            </p>
            <p className="mt-2 text-sm leading-relaxed text-red-600">
              {error.message}
            </p>
            <Link
              href="/diary"
              className="mt-8 inline-block rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
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
      <main className="mx-auto w-full max-w-4xl flex-1 rounded-[2rem] border border-slate-100/50 bg-[#f2f4f7] px-5 py-8 shadow-sm sm:px-8 sm:py-10">
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-semibold tracking-tight text-[#1a1d23]">
              내 일기
            </h1>
            <Link
              href="/diary/new"
              className="inline-flex w-fit items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
            >
              새 일기 쓰기
            </Link>
          </div>

          <form
            method="get"
            action="/diary"
            className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3"
          >
            <label htmlFor="diary-search-q" className="sr-only">
              제목 검색
            </label>
            <input
              id="diary-search-q"
              name="q"
              type="search"
              placeholder="제목으로 검색"
              defaultValue={searchQuery}
              className="min-h-11 w-full min-w-0 flex-1 rounded-full border border-slate-200/80 bg-white px-4 py-2.5 text-sm text-[#1a1d23] shadow-sm outline-none ring-slate-900/0 transition-[box-shadow,border-color] placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-900/10"
            />
            <div className="flex shrink-0 gap-2">
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-800 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-700"
              >
                검색
              </button>
              {searchQuery ? (
                <Link
                  href="/diary"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  초기화
                </Link>
              ) : null}
            </div>
          </form>
        </div>

        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-slate-200/80 bg-white py-20 text-center shadow-sm">
            {searchQuery ? (
              <>
                <p className="text-xl font-bold text-slate-600">
                  검색 결과가 없습니다
                </p>
                <p className="mt-2 text-sm font-normal leading-relaxed text-slate-500">
                  다른 검색어로 다시 시도해 보세요.
                </p>
                <Link
                  href="/diary"
                  className="mt-8 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
                >
                  전체 목록 보기
                </Link>
              </>
            ) : (
              <>
                <p className="text-xl font-bold text-slate-600">
                  아직 작성한 일기가 없습니다
                </p>
                <p className="mt-2 text-sm font-normal leading-relaxed text-slate-500">
                  첫 번째 일기를 작성해 보세요!
                </p>
                <Link
                  href="/diary/new"
                  className="mt-8 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
                >
                  일기 쓰기
                </Link>
              </>
            )}
          </div>
        ) : (
          <ul className="space-y-4">
            {entries.map((entry) => {
              const mood = moodConfig[parseMood(entry.mood)];
              return (
                <li key={entry.id}>
                  <Link
                    href={`/diary/${entry.id}`}
                    className="group flex items-center gap-5 rounded-[1.25rem] border border-slate-100/50 bg-white px-6 py-5 shadow-sm transition-all hover:border-slate-200/80 hover:shadow-md"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl">
                      {mood.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-[#1a1d23] group-hover:text-slate-700">
                        {entry.title}
                      </p>
                      <p className="mt-1 text-sm font-normal text-slate-500">
                        <span>{mood.label}</span>
                        <span className="mx-1.5">·</span>
                        <span>{formatDate(entry.created_at)}</span>
                      </p>
                    </div>
                    <svg
                      className="h-5 w-5 shrink-0 text-slate-300 transition-colors group-hover:text-slate-500"
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
