"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundaryPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log uncaught client errors to console (or external error monitoring like Sentry)
    console.error("[Root Error Boundary Caught Error]:", error);
  }, [error]);

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
      <div className="border-border bg-card mx-auto max-w-md space-y-4 rounded-xl border p-6 shadow-sm sm:p-8">
        <div className="bg-destructive/10 text-destructive mx-auto flex size-12 items-center justify-center rounded-full">
          <AlertTriangle className="size-6" />
        </div>

        <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
          Đã có lỗi xảy ra
        </h1>

        <p className="text-muted-foreground text-sm">
          {error.message || "Hệ thống gặp sự cố không mong muốn trong khi xử lý yêu cầu."}
        </p>

        {error.digest && (
          <p className="text-muted-foreground/70 font-mono text-[11px]">
            Mã lỗi (Digest): {error.digest}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <Button onClick={() => reset()} variant="default" className="gap-2">
            <RefreshCw className="size-4" />
            Thử lại
          </Button>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <Home className="size-4" />
              Trang chủ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
