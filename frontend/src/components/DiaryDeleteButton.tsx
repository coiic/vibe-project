"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DiaryDeleteButton({ entryId }: { entryId: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("정말로 이 일기를 삭제하시겠습니까?")) return;
    setError("");
    setDeleting(true);

    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from("entries")
      .delete()
      .eq("id", entryId);

    setDeleting(false);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    router.refresh();
    router.push("/diary");
  };

  return (
    <div className="flex flex-col items-end gap-2">
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {deleting ? "삭제 중…" : "삭제"}
      </button>
    </div>
  );
}
