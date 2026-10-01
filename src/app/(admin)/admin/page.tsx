import type { Metadata } from "next";
import { Activity, Database, ShieldCheck, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Khu vực quản trị hệ thống | Admin Dashboard",
  description: "Trang quản trị hệ thống và kiểm soát quyền truy cập tài khoản.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Khu vực quản trị hệ thống</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Bảng điều khiển dành riêng cho quản trị viên và nhân viên kỹ thuật (Admin & Staff).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bảo mật hệ thống</CardTitle>
            <ShieldCheck className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">JWT Verified</div>
            <p className="text-muted-foreground mt-1 text-xs">
              Role verification qua signed claims
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Người dùng</CardTitle>
            <Users className="text-primary size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-muted-foreground mt-1 text-xs">Quản lý phiên đăng nhập an toàn</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Trạng thái API</CardTitle>
            <Activity className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Operational</div>
            <p className="text-muted-foreground mt-1 text-xs">FastAPI Gateway kết nối ổn định</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đồng bộ dữ liệu</CardTitle>
            <Database className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Auto-Sync</div>
            <p className="text-muted-foreground mt-1 text-xs">Snapshot tự động 5 nền tảng</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
