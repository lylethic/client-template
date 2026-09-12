/**
 * Dashboard route group layout.
 *
 * Only reachable by authenticated users (enforced in middleware).
 * Replace this stub with your customer app shell.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-card border-b px-6 py-4">
        <p className="text-muted-foreground text-sm font-semibold">Social Metrics</p>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
