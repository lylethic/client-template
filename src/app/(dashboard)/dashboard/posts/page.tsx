"use client";

import * as React from "react";
import {
  ExternalLink,
  Eye,
  MessageSquare,
  Share2,
  Sparkles,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";

import { usePosts } from "@/hooks/use-posts";
import { PostAiDialog } from "@/components/dashboard/post-ai-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

function formatNumber(n?: number): string {
  if (n === undefined || n === null) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

const PLATFORM_OPTIONS = [
  { value: "all", label: "Tất cả nền tảng" },
  { value: "youtube", label: "YouTube" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "threads", label: "Threads" },
];

const POST_TYPE_OPTIONS = [
  { value: "all", label: "Tất cả định dạng" },
  { value: "video", label: "Video dài" },
  { value: "short", label: "YouTube Short" },
  { value: "reel", label: "Reel" },
  { value: "photo", label: "Hình ảnh" },
  { value: "text", label: "Văn bản" },
];

const PAGE_SIZE = 15;

export default function PostsPage() {
  const [platform, setPlatform] = React.useState<string | undefined>(undefined);
  const [postType, setPostType] = React.useState<string | undefined>(undefined);
  const [page, setPage] = React.useState(1);

  const { data, isLoading } = usePosts({
    platform,
    post_type: postType,
    page,
    page_size: PAGE_SIZE,
  });

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="border-border/80 flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            Danh Sách & Hiệu Suất Bài Viết
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {data
              ? `Tổng cộng ${data.total} bài đăng đã được đồng bộ số liệu`
              : "Đang tải danh sách bài viết..."}
          </p>
        </div>

        {/* Bộ lọc Platform & Post Type: 2 cột trên mobile, row trên desktop */}
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center">
          <Select
            value={platform ?? "all"}
            onValueChange={(v) => {
              setPlatform(!v || v === "all" ? undefined : v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full text-xs sm:w-38">
              <SelectValue placeholder="Nền tảng" />
            </SelectTrigger>
            <SelectContent>
              {PLATFORM_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value} className="text-xs">
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={postType ?? "all"}
            onValueChange={(v) => {
              setPostType(!v || v === "all" ? undefined : v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full text-xs sm:w-36">
              <SelectValue placeholder="Định dạng" />
            </SelectTrigger>
            <SelectContent>
              {POST_TYPE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value} className="text-xs">
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Danh sách bài đăng */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : data?.items.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="space-y-2 py-16 text-center">
            <p className="text-foreground font-medium">Không tìm thấy bài viết nào</p>
            <p className="text-muted-foreground text-xs">
              Thử thay đổi bộ lọc hoặc bấm &quot;Đồng bộ&quot; trong trang Kênh để cào bài đăng mới
              nhất.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {data?.items.map((post) => {
            const metrics = post.latest_metrics;
            const er = metrics?.engagement_rate ?? 0;

            return (
              <Card
                key={post.id}
                className="border-border/70 hover:border-border overflow-hidden shadow-xs transition-colors"
              >
                <div className="flex gap-3 p-3.5 sm:gap-4 sm:p-5">
                  {/* Ảnh thu nhỏ Thumbnail: tỷ lệ cân đối trên mọi màn hình */}
                  {post.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.thumbnail_url}
                      alt={post.title ?? "Thumbnail bài viết"}
                      className="border-border size-16 shrink-0 rounded-lg border object-cover sm:size-24"
                    />
                  ) : (
                    <div className="bg-muted text-muted-foreground flex size-16 shrink-0 items-center justify-center rounded-lg p-1 text-center text-[10px] font-medium sm:size-24 sm:text-xs">
                      Không có ảnh
                    </div>
                  )}

                  {/* Nội dung chi tiết */}
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2 sm:gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-foreground line-clamp-2 text-xs font-semibold sm:text-sm">
                          {post.title ?? post.content?.slice(0, 100) ?? "Bài viết không tiêu đề"}
                        </h3>
                        <p className="text-muted-foreground mt-1 truncate text-[11px] sm:text-xs">
                          {post.channel_name} · <span className="capitalize">{post.platform}</span>{" "}
                          · {new Date(post.published_at).toLocaleDateString("vi-VN")}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                        <Badge variant="outline" className="px-1.5 py-0 text-[10px] capitalize">
                          {post.post_type}
                        </Badge>
                        {post.url && (
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground rounded p-1"
                            title="Mở bài viết gốc"
                          >
                            <ExternalLink className="size-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Dòng chỉ số tương tác */}
                    <div className="border-border/50 flex flex-col justify-between gap-2 border-t pt-2 sm:flex-row sm:items-center">
                      <div className="flex flex-wrap items-center gap-2.5 text-[11px] sm:gap-4 sm:text-xs">
                        <span className="text-foreground flex items-center gap-1 font-medium">
                          <Eye className="text-muted-foreground size-3 sm:size-3.5" />
                          {formatNumber(metrics?.views_count)}
                        </span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <ThumbsUp className="size-3 sm:size-3.5" />
                          {formatNumber(metrics?.likes_count)}
                        </span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <MessageSquare className="size-3 sm:size-3.5" />
                          {formatNumber(metrics?.comments_count)}
                        </span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Share2 className="size-3 sm:size-3.5" />
                          {formatNumber(metrics?.shares_count)}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                          <TrendingUp className="size-3 sm:size-3.5" />
                          {er.toFixed(2)}% ER
                        </span>
                      </div>

                      {/* Nút phân tích AI cho bài viết này */}
                      <div className="w-full pt-1 sm:w-auto sm:pt-0">
                        <PostAiDialog
                          postId={post.id}
                          postTitle={post.title}
                          trigger={
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 w-full justify-center gap-1.5 text-xs text-amber-600 shadow-2xs hover:text-amber-700 sm:w-auto dark:text-amber-400"
                            >
                              <Sparkles className="size-3.5" />
                              Phân tích cảm xúc AI
                            </Button>
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="text-xs"
          >
            Trang trước
          </Button>
          <span className="text-muted-foreground text-xs font-medium">
            Trang {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="text-xs"
          >
            Trang sau
          </Button>
        </div>
      )}
    </div>
  );
}
