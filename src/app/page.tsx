import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, Bot, ShieldCheck, Sparkles } from "lucide-react";

import { Navbar } from "@/components/common/navbar";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Social Metrics — Nền tảng phân tích số liệu mạng xã hội & AI Insights",
  description:
    "Theo dõi, đo lường và tối ưu hóa hiệu suất đa kênh (YouTube, TikTok, Facebook, Instagram, Threads) với công nghệ tư vấn chiến lược tự động bằng AI.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Social Metrics — Unified Social Media Analytics & AI Insights",
    description:
      "Tối ưu hóa hiệu suất truyền thông mạng xã hội trên đa nền tảng với AI phân tích nội dung tự động.",
    url: "/",
    type: "website",
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Social Metrics",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Nền tảng phân tích số liệu mạng xã hội đa kênh kết hợp AI Insights giúp đo lường chỉ số tăng trưởng và tối ưu hóa nội dung.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <div className="border-primary/20 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold">
            <Sparkles className="size-3.5" />
            Trợ lý phân tích hiệu suất mạng xã hội thế hệ mới
          </div>

          <h1 className="text-foreground text-4xl font-extrabold tracking-tight sm:text-6xl sm:leading-tight">
            Nắm trọn chỉ số <span className="text-primary">đa kênh</span> với sức mạnh AI
          </h1>

          <p className="text-muted-foreground mx-auto max-w-2xl text-base sm:text-lg">
            Hợp nhất dữ liệu tăng trưởng từ YouTube, TikTok, Facebook, Instagram và Threads trên một
            bảng điều khiển duy nhất. Nhận tư vấn nội dung thông minh theo thời gian thực.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 font-medium shadow-md">
                Khám phá Dashboard
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="font-medium">
                Đăng nhập
              </Button>
            </Link>
          </div>

          {/* Value props */}
          <div className="grid grid-cols-1 gap-6 pt-16 text-left sm:grid-cols-3">
            <div className="border-border bg-card rounded-xl border p-6 shadow-xs">
              <BarChart3 className="text-primary mb-3 size-8" />
              <h2 className="text-base font-semibold">Đo lường hợp nhất</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Theo dõi người theo dõi, tương tác và tỷ lệ tương tác (ER) trên tất cả các kênh tập
                trung.
              </p>
            </div>

            <div className="border-border bg-card rounded-xl border p-6 shadow-xs">
              <Bot className="text-primary mb-3 size-8" />
              <h2 className="text-base font-semibold">AI Content Strategy</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Phân tích các bài đăng hiệu suất cao và đề xuất định dạng, chủ đề và thời gian đăng
                bài tối ưu.
              </p>
            </div>

            <div className="border-border bg-card rounded-xl border p-6 shadow-xs">
              <ShieldCheck className="text-primary mb-3 size-8" />
              <h2 className="text-base font-semibold">Bảo mật & Đồng bộ</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Xác thực OAuth 2.0 trực tiếp từ nền tảng gốc, đồng bộ số liệu tự động và xuất báo
                cáo PDF/Excel tức thì.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
