import Header from "@/components/Header";

export default function DiaryLoading() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 rounded-[2rem] border border-slate-100/50 bg-[#f2f4f7] px-5 py-8 shadow-sm sm:px-8 sm:py-10">
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-9 w-36 animate-pulse rounded-full bg-slate-200/80" />
            <div className="h-10 w-32 animate-pulse rounded-full bg-slate-200/80" />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="h-11 w-full animate-pulse rounded-full bg-slate-200/80 sm:flex-1" />
            <div className="flex shrink-0 gap-2">
              <div className="h-11 w-20 animate-pulse rounded-full bg-slate-200/80" />
            </div>
          </div>
        </div>
        <ul className="space-y-4">
          {[1, 2, 3].map((i) => (
            <li
              key={i}
              className="flex items-center gap-5 rounded-[1.25rem] border border-slate-100/50 bg-white px-6 py-5 shadow-sm"
            >
              <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-slate-100" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-5 w-3/5 max-w-xs animate-pulse rounded-full bg-slate-100" />
                <div className="h-4 w-2/5 max-w-[200px] animate-pulse rounded-full bg-slate-100" />
              </div>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
