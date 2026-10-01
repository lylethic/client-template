import type { Metadata } from "next";

import { Navbar } from "@/components/common/navbar";

export const metadata: Metadata = {
  title: "Về chúng tôi | About Us",
  description:
    "Tìm hiểu về đội ngũ phát triển Social Metrics và sứ mệnh tối ưu hóa dữ liệu số mạng xã hội.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Về Social Metrics</h1>
        <p className="text-muted-foreground mt-4 text-base leading-relaxed sm:text-lg">
          Social Metrics là giải pháp quản lý và phân tích số liệu mạng xã hội thế hệ mới, hỗ trợ
          các nhà sáng tạo nội dung, doanh nghiệp và đội ngũ marketing nắm bắt xu hướng tương tác,
          tự động hóa báo cáo và tối ưu chiến lược bằng trí tuệ nhân tạo.
        </p>
      </main>
    </>
  );
}
