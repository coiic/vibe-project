"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: signOutError } = await supabase.auth.signOut();
    setLoading(false);

    if (signOutError) {
      setError(signOutError.message);
      return;
    }

    router.refresh();
    router.push("/login");
  };

  return (
    <header className="mb-4 border-0 bg-transparent sm:mb-6">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between rounded-full border border-slate-100/80 bg-white px-5 shadow-sm sm:h-16 sm:px-7">
        <Link
          href="/diary"
          className="text-xl font-bold tracking-tight text-orange-600"
        >
          나만의 일기장
        </Link>
        <div className="flex flex-col items-end gap-1">
        {error && (
          <p className="max-w-xs text-right text-xs text-red-600">{error}</p>
        )}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "로그아웃 중…" : "로그아웃"}
        </button>
        </div>
      </div>
    </header>
  );
}
