"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle, CheckCircle, Radio, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  useDeletePlatformAccount,
  usePlatformAccounts,
  useSyncPlatformAccount,
} from "@/hooks/use-platforms";
import { ConnectPlatformDialog } from "@/components/dashboard/connect-platform-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PLATFORM_COLORS: Record<string, string> = {
  youtube: "bg-red-500",
  tiktok: "bg-black dark:bg-zinc-800",
  facebook: "bg-blue-600",
  instagram: "bg-pink-500",
  threads: "bg-neutral-800 dark:bg-neutral-200",
};

export default function PlatformsPage() {
  const t = useTranslations("platforms");
  const tCommon = useTranslations("common");

  const { data: accounts, isLoading, refetch } = usePlatformAccounts();
  const deleteMutation = useDeletePlatformAccount();
  const syncMutation = useSyncPlatformAccount();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const channel = params.get("channel");
    const error = params.get("error");

    if (success === "youtube_connected" || success === "tiktok_connected") {
      const platformName = success === "tiktok_connected" ? "TikTok" : "YouTube";
      toast.success(
        channel
          ? `Kết nối kênh ${platformName} "${channel}" thành công!`
          : `Kết nối kênh ${platformName} thành công!`,
      );
      refetch();
      window.history.replaceState({}, "", window.location.pathname);
    } else if (error) {
      toast.error(`Kết nối thất bại: ${error}`);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [refetch]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="border-border/80 flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{t("title")}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{t("description")}</p>
        </div>

        <ConnectPlatformDialog />
      </div>

      {/* Connected accounts list */}
      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : accounts?.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="space-y-3 py-16 text-center">
            <div className="bg-muted text-muted-foreground mx-auto flex size-12 items-center justify-center rounded-full">
              <Radio className="size-6" />
            </div>
            <h3 className="text-foreground text-base font-semibold">{t("noAccounts")}</h3>
            <p className="text-muted-foreground mx-auto max-w-md text-xs">{t("noAccountsDesc")}</p>
            <div className="pt-2">
              <ConnectPlatformDialog />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {accounts?.map((acc) => {
            // eslint-disable-next-line react-hooks/purity
            const currentTime = Date.now();
            const isExpired = acc.token_expires_at
              ? new Date(acc.token_expires_at).getTime() < currentTime
              : false;

            return (
              <Card key={acc.id} className="border-border/70 overflow-hidden shadow-xs">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col justify-between gap-3.5 sm:flex-row sm:items-start">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      {acc.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={acc.avatar_url}
                          alt={acc.account_name}
                          className="border-border size-11 shrink-0 rounded-full border object-cover sm:size-12"
                        />
                      ) : (
                        <div
                          className={`flex size-11 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white sm:size-12 ${
                            PLATFORM_COLORS[acc.platform] ?? "bg-gray-500"
                          }`}
                        >
                          {acc.platform.slice(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <p className="text-foreground truncate text-sm font-semibold">
                            {acc.account_name}
                          </p>
                          <Badge variant="outline" className="px-1.5 py-0 text-[10px] capitalize">
                            {acc.platform}
                          </Badge>
                        </div>

                        <p className="text-muted-foreground truncate text-xs">
                          {t("idHandle")} {acc.account_handle ?? acc.platform_account_id}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px]">
                          {isExpired ? (
                            <span className="flex items-center gap-1 font-medium text-rose-600 dark:text-rose-400">
                              <AlertTriangle className="size-3 shrink-0" /> {tCommon("expired")}
                            </span>
                          ) : acc.is_active ? (
                            <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                              <CheckCircle className="size-3 shrink-0" /> {tCommon("active")}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">{tCommon("inactive")}</span>
                          )}

                          {acc.token_expires_at && (
                            <span className="text-muted-foreground">
                              · {t("tokenExpires")}{" "}
                              {new Date(acc.token_expires_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-border/50 flex shrink-0 gap-1.5 border-t pt-2 sm:flex-col sm:border-t-0 sm:pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 flex-1 cursor-pointer justify-center gap-1 text-xs shadow-2xs sm:flex-initial"
                        disabled={syncMutation.isPending}
                        onClick={() => syncMutation.mutate({ accountId: acc.id })}
                      >
                        <RefreshCw
                          className={`size-3 ${syncMutation.isPending ? "animate-spin" : ""}`}
                        />
                        {syncMutation.isPending ? tCommon("syncing") : tCommon("sync")}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 flex-1 cursor-pointer justify-center gap-1 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 sm:flex-initial dark:hover:bg-rose-950/30"
                        disabled={deleteMutation.isPending}
                        onClick={() => {
                          if (confirm(t("disconnectConfirm", { name: acc.account_name }))) {
                            deleteMutation.mutate(acc.id);
                          }
                        }}
                      >
                        <Trash2 className="size-3" />
                        {t("disconnect")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Platform connection guide */}
      <Card className="border-border/70 bg-muted/20 shadow-xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">{t("guideTitle")}</CardTitle>
          <CardDescription className="text-xs">{t("guideDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-2 text-xs">
          <p>{t("guideOauth")}</p>
          <p>{t("guidePublic")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
