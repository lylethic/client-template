import type { Metadata } from "next";

import { Navbar } from "@/components/common/navbar";

export const metadata: Metadata = {
  title: "Dịch vụ & Tính năng | Services",
  description:
    "Khám phá các dịch vụ đo lường đa kênh, phân tích tương tác và tích hợp AI của Social Metrics.",
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Dịch vụ & Tính năng</h1>
        <p className="text-muted-foreground mt-4 text-base leading-relaxed sm:text-lg">
          Chúng tôi cung cấp hệ sinh thái đo lường toàn diện bao gồm: Phân tích tăng trưởng theo
          thời gian, đề xuất chiến lược nội dung tự động bằng AI, trích xuất dữ liệu snapshot lịch
          sử, và báo cáo chuyên sâu định dạng Excel và PDF.
        </p>
      </main>
    </>
  );
}
