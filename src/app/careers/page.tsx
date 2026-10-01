import type { Metadata } from "next";

import { Navbar } from "@/components/common/navbar";

export const metadata: Metadata = {
  title: "Cơ hội nghề nghiệp | Careers",
  description:
    "Tham gia đội ngũ phát triển Social Metrics để kiến tạo tương lai của phân tích dữ liệu mạng xã hội.",
  alternates: {
    canonical: "/careers",
  },
};

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Cơ hội nghề nghiệp</h1>
        <p className="text-muted-foreground mt-4 text-base leading-relaxed sm:text-lg">
          Social Metrics luôn tìm kiếm những kỹ sư, nhà khoa học dữ liệu và chuyên gia sản phẩm tài
          năng để cùng nhau xây dựng các giải pháp phân tích dữ liệu mạng xã hội quy mô lớn.
        </p>
      </main>
    </>
  );
}
