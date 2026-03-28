"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { createClient } from "@/lib/supabase/client";
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
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (!title.trim()) next.title = "제목을 입력해주세요.";
    if (!content.trim()) next.content = "내용을 입력해주세요.";
    if (!mood) next.mood = "기분을 선택해주세요.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitError("");
    setSaving(true);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("entries")
      .insert({
        title: title.trim(),
        content: content.trim(),
        mood: mood!,
      })
      .select()
      .single();

    setSaving(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    if (!data?.id) {
      setSubmitError("일기를 저장했지만 상세 정보를 불러올 수 없습니다.");
      return;
    }

    router.refresh();
    router.push(`/diary/${data.id}`);
  };

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 rounded-[2rem] border border-slate-100/50 bg-[#f2f4f7] px-5 py-8 shadow-sm sm:px-8 sm:py-10">
        <Link
          href="/diary"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-orange-600"
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

        <h1 className="mb-6 text-3xl font-semibold tracking-tight text-[#1a1d23]">
          새 일기 쓰기
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-[1.75rem] border border-slate-100/50 bg-white p-6 shadow-sm sm:p-8"
        >
          {submitError && (
            <p
              className="rounded-2xl border border-red-100 bg-red-50/80 px-4 py-2.5 text-sm text-red-600"
              role="alert"
            >
              {submitError}
            </p>
          )}

          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-slate-700"
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
              className={`w-full rounded-2xl border bg-slate-50/30 px-4 py-3 text-sm text-[#1a1d23] placeholder-slate-400 outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-orange-500/15 ${
                errors.title
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-200 focus:border-orange-400"
              }`}
            />
            {errors.title && (
              <p className="mt-1.5 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
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
                      ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
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
              className="mb-2 block text-sm font-medium text-slate-700"
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
              className={`w-full resize-none rounded-2xl border bg-slate-50/30 px-4 py-3 text-sm font-normal leading-relaxed text-[#1a1d23] placeholder-slate-400 outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-orange-500/15 ${
                errors.content
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-200 focus:border-orange-400"
              }`}
            />
            {errors.content && (
              <p className="mt-1.5 text-sm text-red-500">{errors.content}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-8">
            <Link
              href="/diary"
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "저장 중…" : "저장"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
