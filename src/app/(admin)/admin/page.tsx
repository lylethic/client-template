import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin" };

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="text-muted-foreground mt-2">
        Welcome. This area is restricted to Admin and Staff roles.
      </p>
    </div>
  );
}
