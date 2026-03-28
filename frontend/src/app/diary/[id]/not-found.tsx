import Link from "next/link";
import Header from "@/components/Header";

export default function DiaryEntryNotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 rounded-[2rem] border border-slate-100/50 bg-[#f2f4f7] px-5 py-8 shadow-sm sm:px-8 sm:py-10">
        <div className="flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-slate-200/80 bg-white py-20 text-center shadow-sm">
          <p className="text-xl font-bold text-slate-600">
            일기를 찾을 수 없습니다
          </p>
          <p className="mt-2 text-sm font-normal leading-relaxed text-slate-500">
            존재하지 않거나 삭제된 일기입니다.
          </p>
          <Link
            href="/diary"
            className="mt-8 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </main>
    </>
  );
}
