import Link from "next/link";
import Header from "@/components/Header";

export default function DiaryEntryNotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 py-20 text-center">
          <p className="text-lg font-medium text-zinc-500">
            일기를 찾을 수 없습니다
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            존재하지 않거나 삭제된 일기입니다.
          </p>
          <Link
            href="/diary"
            className="mt-6 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </main>
    </>
  );
}
