import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/diary");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
          나만의 일기장
        </h1>
        <p className="mt-4 text-lg text-zinc-600">
          하루의 기록을 간편하게 남기고,
          <br />
          그날의 기분까지 함께 저장하세요.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
          >
            로그인
          </Link>
          <Link
            href="/signup"
            className="rounded-lg border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
