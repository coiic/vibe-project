import Header from "@/components/Header";

export default function DiaryLoading() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="h-8 w-32 animate-pulse rounded bg-zinc-200" />
          <div className="h-10 w-28 animate-pulse rounded-lg bg-zinc-200" />
        </div>
        <ul className="space-y-3">
          {[1, 2, 3].map((i) => (
            <li
              key={i}
              className="flex items-center gap-4 rounded-xl border border-zinc-100 bg-zinc-50 px-5 py-4"
            >
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-zinc-200" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-5 w-3/5 max-w-xs animate-pulse rounded bg-zinc-200" />
                <div className="h-4 w-2/5 max-w-[200px] animate-pulse rounded bg-zinc-200" />
              </div>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
