"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <Link href="/diary" className="text-xl font-bold text-zinc-900">
          나만의 일기장
        </Link>
        <button
          onClick={handleLogout}
          className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}
