"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    router.push("/login");
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-2 py-10 sm:py-14">
      <div className="w-full max-w-sm rounded-[2rem] border border-slate-100/50 bg-white px-8 py-10 shadow-sm sm:px-10 sm:py-12">
        <h1 className="text-center text-3xl font-semibold tracking-tight text-[#1a1d23]">
          회원가입
        </h1>
        <p className="mt-2 text-center text-sm font-normal leading-relaxed text-slate-500">
          새 계정을 만들어 일기를 시작하세요
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
              placeholder="6자 이상 입력"
              className="mt-2 block w-full rounded-full border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-[#1a1d23] shadow-sm placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/15"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-700"
            >
              비밀번호 확인
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력"
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
            {loading ? "가입 중…" : "회원가입"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/login"
            className="font-semibold text-orange-600 hover:underline"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
