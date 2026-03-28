"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import type { Mood } from "@/types/entry";

const moodOptions: { value: Mood; emoji: string; label: string }[] = [
  { value: "happy", emoji: "😊", label: "행복" },
  { value: "sad", emoji: "😢", label: "슬픔" },
  { value: "angry", emoji: "😠", label: "화남" },
  { value: "neutral", emoji: "😐", label: "보통" },
  { value: "excited", emoji: "🤩", label: "신남" },
];

export default function DiaryNewPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<Mood | null>(null);
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    mood?: string;
  }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (!title.trim()) next.title = "제목을 입력해주세요.";
    if (!content.trim()) next.content = "내용을 입력해주세요.";
    if (!mood) next.mood = "기분을 선택해주세요.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    router.push("/diary");
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

        <h1 className="mb-6 text-2xl font-bold text-zinc-900">새 일기 쓰기</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8"
        >
          <div>
            <label
              htmlFor="title"
              className="mb-1.5 block text-sm font-medium text-zinc-700"
            >
              제목
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="오늘의 일기 제목"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:ring-2 focus:ring-zinc-900/10 ${
                errors.title
                  ? "border-red-400 focus:border-red-500"
                  : "border-zinc-200 focus:border-zinc-400"
              }`}
            />
            {errors.title && (
              <p className="mt-1.5 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
              기분
            </label>
            <div className="flex flex-wrap gap-2">
              {moodOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setMood(option.value);
                    if (errors.mood) setErrors((prev) => ({ ...prev, mood: undefined }));
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    mood === option.value
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                  }`}
                >
                  <span className="text-base">{option.emoji}</span>
                  {option.label}
                </button>
              ))}
            </div>
            {errors.mood && (
              <p className="mt-1.5 text-sm text-red-500">{errors.mood}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="content"
              className="mb-1.5 block text-sm font-medium text-zinc-700"
            >
              내용
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errors.content)
                  setErrors((prev) => ({ ...prev, content: undefined }));
              }}
              placeholder="오늘 하루는 어땠나요?"
              rows={8}
              className={`w-full resize-none rounded-lg border px-4 py-2.5 text-sm leading-relaxed text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:ring-2 focus:ring-zinc-900/10 ${
                errors.content
                  ? "border-red-400 focus:border-red-500"
                  : "border-zinc-200 focus:border-zinc-400"
              }`}
            />
            {errors.content && (
              <p className="mt-1.5 text-sm text-red-500">{errors.content}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-zinc-100 pt-6">
            <Link
              href="/diary"
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              취소
            </Link>
            <button
              type="submit"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
            >
              저장
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
