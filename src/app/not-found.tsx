import Link from "next/link";
import { Home, LayoutDashboard } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
      <div className="space-y-4">
        <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider uppercase">
          404 Not Found
        </span>
        <h1 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
          Trang không tồn tại
        </h1>
        <p className="text-muted-foreground mx-auto max-w-md text-sm sm:text-base">
          Trang bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc đường dẫn bị thay đổi.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link href="/">
            <Button variant="default" className="gap-2">
              <Home className="size-4" />
              Trang chủ
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2">
              <LayoutDashboard className="size-4" />
              Về Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
