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
    <div className="flex flex-1 flex-col items-center justify-center px-2 py-10 sm:py-14">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-100/50 bg-white px-10 py-12 text-center shadow-sm sm:px-12 sm:py-14">
        <h1 className="text-3xl font-semibold tracking-tight text-orange-600 sm:text-4xl">
          나만의 일기장
        </h1>
        <p className="mt-4 text-sm font-normal leading-relaxed text-slate-500 sm:text-base">
          하루의 기록을 간편하게 남기고,
          <br />
          그날의 기분까지 함께 저장하세요.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
          >
            로그인
          </Link>
          <Link
            href="/signup"
            className="rounded-full border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
