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
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <Link href="/diary" className="text-xl font-bold text-zinc-900">
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
          className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "로그아웃 중…" : "로그아웃"}
        </button>
        </div>
      </div>
    </header>
  );
}
