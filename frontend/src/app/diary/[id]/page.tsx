"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { mockEntries } from "@/lib/mockData";
import Header from "@/components/Header";
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

export default function DiaryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const entry = mockEntries.find((e) => e.id === id);

  if (!entry) {
    return (
      <>
        <Header />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 py-20 text-center">
            <p className="text-lg font-medium text-zinc-500">
              일기를 찾을 수 없습니다
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              존재하지 않거나 삭제된 일기입니다.
            </p>
            <Link
              href="/diary"
              className="mt-6 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
            >
              목록으로 돌아가기
            </Link>
          </div>
        </main>
      </>
    );
  }

  const mood = moodConfig[entry.mood];
  const isEdited = entry.updated_at !== entry.created_at;

  const handleDelete = () => {
    if (confirm("정말로 이 일기를 삭제하시겠습니까?")) {
      router.push("/diary");
    }
  };

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
          <button
            onClick={handleDelete}
            className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            삭제
          </button>
        </div>
      </main>
    </>
  );
}
