"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[Global Error Caught]:", error);
  }, [error]);

  return (
    <html lang="vi">
      <body className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        <div className="mx-auto max-w-md space-y-4 rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-lg sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
            ⚠️
          </div>

          <h1 className="text-xl font-bold tracking-tight">Sự cố hệ thống nghiêm trọng</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {error.message || "Ứng dụng gặp sự cố cấp khung giao diện. Vui lòng tải lại trang."}
          </p>

          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Tải lại ứng dụng
          </button>
        </div>
      </body>
    </html>
  );
}
