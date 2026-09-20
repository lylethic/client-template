import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Admin route group layout.
 *
 * Only reachable by users with ADMIN or STAFF roles (enforced in middleware).
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <header className="bg-card flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg text-sm font-black select-none">
            SM
          </span>
          <div>
            <p className="text-sm leading-none font-bold">Admin Panel</p>
            <p className="text-muted-foreground mt-0.5 text-xs">Khu vực quản trị hệ thống</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs shadow-2xs">
              <LayoutDashboard className="text-primary size-3.5" />
              Về Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-3.5 sm:p-6">{children}</main>
    </div>
  );
}
