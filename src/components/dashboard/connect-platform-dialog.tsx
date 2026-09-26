"use client";

import { FormEvent, isValidElement, ReactElement, ReactNode, useState } from "react";
import { Link2, Plus, Radio, RefreshCw } from "lucide-react";

import {
  useConnectFacebookPage,
  useConnectYouTubeChannelById,
  useFacebookAuthUrl,
  useInstagramAuthUrl,
  useThreadsAuthUrl,
  useTikTokAuthUrl,
  useYouTubeAuthUrl,
} from "@/hooks/use-platforms";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ConnectPlatformDialogProps {
  trigger?: ReactNode;
  defaultPlatform?: "youtube" | "tiktok" | "facebook" | "instagram" | "threads";
}

export function ConnectPlatformDialog({
  trigger,
  defaultPlatform = "youtube",
}: ConnectPlatformDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(defaultPlatform);

  // YouTube states
  const [ytChannelId, setYtChannelId] = useState("");
  const connectYtMutation = useConnectYouTubeChannelById();
  const { refetch: fetchYtAuthUrl, isFetching: ytAuthLoading } = useYouTubeAuthUrl();

  // TikTok states
  const { refetch: fetchTikTokAuthUrl, isFetching: tikTokAuthLoading } = useTikTokAuthUrl();

  // Facebook states
  const [fbPageId, setFbPageId] = useState("");
  const connectFbPageMutation = useConnectFacebookPage();
  const { refetch: fetchFbAuthUrl, isFetching: fbAuthLoading } = useFacebookAuthUrl();

  // Instagram & Threads states
  const { refetch: fetchIgAuthUrl, isFetching: igAuthLoading } = useInstagramAuthUrl();
  const { refetch: fetchThreadsAuthUrl, isFetching: threadsAuthLoading } = useThreadsAuthUrl();

  // Handlers
  const handleConnectYtById = async (e: FormEvent) => {
    e.preventDefault();
    if (!ytChannelId.trim()) return;
    await connectYtMutation.mutateAsync({ channel_id: ytChannelId.trim() });
    setYtChannelId("");
    setOpen(false);
  };

  const handleOAuthRedirect = async (
    fetchUrlFn: () => Promise<{ data?: { authorization_url: string } }>,
  ) => {
    const res = await fetchUrlFn();
    if (res.data?.authorization_url) {
      window.location.href = res.data.authorization_url;
    }
  };

  const handleConnectFbPage = async (e: FormEvent) => {
    e.preventDefault();
    if (!fbPageId.trim()) return;
    await connectFbPageMutation.mutateAsync({ page_id: fbPageId.trim() });
    setFbPageId("");
    setOpen(false);
  };

  let renderTrigger: ReactElement;
  if (trigger) {
    renderTrigger = isValidElement(trigger) ? (
      (trigger as ReactElement)
    ) : (
      <Button size="sm" className="cursor-pointer">
        {trigger}
      </Button>
    );
  } else {
    renderTrigger = (
      <Button size="sm" className="cursor-pointer gap-1.5 shadow-xs">
        <Plus className="size-4" aria-hidden="true" />
        Kết nối kênh mới
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={renderTrigger} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Liên kết tài khoản Mạng Xã Hội</DialogTitle>
          <DialogDescription>
            Chọn nền tảng bạn muốn đồng bộ số liệu và phân tích dữ liệu tự động.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as string)}
          className="w-full"
        >
          <TabsList className="mb-4 grid w-full grid-cols-5">
            <TabsTrigger value="youtube" className="text-xs">
              YouTube
            </TabsTrigger>
            <TabsTrigger value="tiktok" className="text-xs">
              TikTok
            </TabsTrigger>
            <TabsTrigger value="facebook" className="text-xs">
              Facebook
            </TabsTrigger>
            <TabsTrigger value="instagram" className="text-xs">
              Instagram
            </TabsTrigger>
            <TabsTrigger value="threads" className="text-xs">
              Threads
            </TabsTrigger>
          </TabsList>

          {/* ── YouTube Tab ── */}
          <TabsContent value="youtube" className="space-y-4">
            <div className="border-border/70 bg-muted/30 space-y-1 rounded-lg border p-3 text-xs">
              <p className="text-foreground font-semibold">Cách 1: Kết nối nhanh bằng Channel ID</p>
              <p className="text-muted-foreground">
                Nhập Channel ID công khai (ví dụ: UC_x5XG1OV2P6uZZ5FSM9Ttw) hoặc Handle kênh.
              </p>
            </div>
            <form onSubmit={handleConnectYtById} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="yt-channel-id" className="text-xs">
                  YouTube Channel ID / Handle
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="yt-channel-id"
                    placeholder="UC... hoặc @tenkenh"
                    value={ytChannelId}
                    onChange={(e) => setYtChannelId(e.target.value)}
                    className="text-xs"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!ytChannelId.trim() || connectYtMutation.isPending}
                  >
                    {connectYtMutation.isPending ? (
                      <RefreshCw className="size-4 animate-spin" />
                    ) : (
                      "Kết nối"
                    )}
                  </Button>
                </div>
              </div>
            </form>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="border-border w-full border-t" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-popover text-muted-foreground px-2">hoặc</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full gap-2 text-xs"
              disabled={ytAuthLoading}
              onClick={() => handleOAuthRedirect(fetchYtAuthUrl)}
            >
              {ytAuthLoading ? (
                <RefreshCw className="size-4 animate-spin" />
              ) : (
                <Link2 className="size-4 text-red-500" />
              )}
              Ủy quyền đầy đủ qua Google OAuth
            </Button>
          </TabsContent>

          {/* ── TikTok Tab ── */}
          <TabsContent value="tiktok" className="space-y-4">
            <div className="border-border/70 bg-muted/30 space-y-1 rounded-lg border p-3 text-xs">
              <p className="text-foreground font-semibold">TikTok for Developers (API v2)</p>
              <p className="text-muted-foreground">
                Ủy quyền tài khoản TikTok Creator/Business để tự động đồng bộ video, lượt xem, lượt
                thích và người theo dõi.
              </p>
            </div>

            <Button
              type="button"
              className="w-full gap-2 text-xs hover:bg-neutral-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              disabled={tikTokAuthLoading}
              onClick={() => handleOAuthRedirect(fetchTikTokAuthUrl)}
            >
              {tikTokAuthLoading ? (
                <RefreshCw className="size-4 animate-spin" />
              ) : (
                <Link2 className="size-4" />
              )}
              Đăng nhập bằng TikTok (OAuth v2)
            </Button>
          </TabsContent>

          {/* ── Facebook Tab ── */}
          <TabsContent value="facebook" className="space-y-4">
            <div className="border-border/70 bg-muted/30 space-y-1 rounded-lg border p-3 text-xs">
              <p className="text-foreground font-semibold">Liên kết Fanpage Facebook</p>
              <p className="text-muted-foreground">
                Ủy quyền tài khoản Meta để đồng bộ toàn bộ Page hoặc nhập trực tiếp Page ID.
              </p>
            </div>

            <Button
              type="button"
              className="w-full gap-2 bg-blue-600 text-xs text-white hover:bg-blue-700"
              disabled={fbAuthLoading}
              onClick={() => handleOAuthRedirect(fetchFbAuthUrl)}
            >
              {fbAuthLoading ? (
                <RefreshCw className="size-4 animate-spin" />
              ) : (
                <Link2 className="size-4" />
              )}
              Đăng nhập bằng Facebook (Meta OAuth)
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="border-border w-full border-t" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-popover text-muted-foreground px-2">hoặc nhập Page ID</span>
              </div>
            </div>

            <form onSubmit={handleConnectFbPage} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="fb-page-id" className="text-xs">
                  Facebook Fanpage ID
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="fb-page-id"
                    placeholder="Ví dụ: 1018085574730508"
                    value={fbPageId}
                    onChange={(e) => setFbPageId(e.target.value)}
                    className="text-xs"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!fbPageId.trim() || connectFbPageMutation.isPending}
                  >
                    {connectFbPageMutation.isPending ? (
                      <RefreshCw className="size-4 animate-spin" />
                    ) : (
                      "Liên kết"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>

          {/* ── Instagram Tab ── */}
          <TabsContent value="instagram" className="space-y-4">
            <div className="border-border/70 bg-muted/30 space-y-1 rounded-lg border p-3 text-xs">
              <p className="text-foreground font-semibold">Instagram Business & Creator</p>
              <p className="text-muted-foreground">
                Yêu cầu tài khoản Instagram Business đã được liên kết với Facebook Fanpage.
              </p>
            </div>

            <Button
              type="button"
              className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-xs text-white hover:opacity-90"
              disabled={igAuthLoading}
              onClick={() => handleOAuthRedirect(fetchIgAuthUrl)}
            >
              {igAuthLoading ? (
                <RefreshCw className="size-4 animate-spin" />
              ) : (
                <Radio className="size-4" />
              )}
              Ủy quyền Instagram OAuth
            </Button>
          </TabsContent>

          {/* ── Threads Tab ── */}
          <TabsContent value="threads" className="space-y-4">
            <div className="border-border/70 bg-muted/30 space-y-1 rounded-lg border p-3 text-xs">
              <p className="text-foreground font-semibold">Threads by Meta</p>
              <p className="text-muted-foreground">
                Ủy quyền OAuth để lấy số liệu tương tác bài đăng Threads (Token hợp lệ 60 ngày).
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full gap-2 text-xs"
              disabled={threadsAuthLoading}
              onClick={() => handleOAuthRedirect(fetchThreadsAuthUrl)}
            >
              {threadsAuthLoading ? (
                <RefreshCw className="size-4 animate-spin" />
              ) : (
                <Link2 className="size-4" />
              )}
              Ủy quyền Threads OAuth
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
