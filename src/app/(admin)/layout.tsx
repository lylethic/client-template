/**
 * Admin route group layout.
 *
 * Only reachable by users with ADMIN or STAFF roles (enforced in middleware).
 * Replace this stub with your admin shell (sidebar, topbar, etc.)
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-card border-b px-6 py-4">
        <p className="text-muted-foreground text-sm font-semibold">Admin Panel</p>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
