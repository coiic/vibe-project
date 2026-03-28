"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.refresh();
    router.push("/diary");
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-2 py-10 sm:py-14">
      <div className="w-full max-w-sm rounded-[2rem] border border-slate-100/50 bg-white px-8 py-10 shadow-sm sm:px-10 sm:py-12">
        <h1 className="text-center text-3xl font-semibold tracking-tight text-[#1a1d23]">
          로그인
        </h1>
        <p className="mt-2 text-center text-sm font-normal leading-relaxed text-slate-500">
          일기장에 오신 것을 환영합니다
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-2 block w-full rounded-full border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-[#1a1d23] shadow-sm placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/15"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 block w-full rounded-full border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-[#1a1d23] shadow-sm placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/15"
            />
          </div>

          {error && (
            <p className="rounded-2xl border border-red-100 bg-red-50/80 px-4 py-2.5 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/25 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "로그인 중…" : "로그인"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          계정이 없으신가요?{" "}
          <Link
            href="/signup"
            className="font-semibold text-orange-600 hover:underline"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
