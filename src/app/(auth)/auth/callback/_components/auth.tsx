"use client";

import { Suspense, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/stores/auth.store";
import { getMe } from "@/modules/auth/auth.service";

function AuthCallbackContentInner() {
  const t = useTranslations("authCallback");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTokens, setUser } = useAuthStore();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;
    const error = searchParams.get("error");

    if (error) {
      toast.error(t("loginFailed", { error }));
      router.replace("/login");
      return;
    }

    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    // Immediately sanitize browser URL & history so tokens are never leaked via Referer or browser history
    if (typeof window !== "undefined" && window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (!accessToken || !refreshToken) {
      toast.error(t("noCredentials"));
      router.replace("/login");
      return;
    }

    const completeLogin = async () => {
      try {
        setTokens(accessToken, refreshToken);
        const user = await getMe();
        setUser(user, accessToken);
        toast.success(t("success"));
        router.replace(user.is_superuser ? "/admin" : "/dashboard");
      } catch {
        toast.error(t("fetchUserError"));
        router.replace("/login");
      }
    };

    void completeLogin();
  }, [router, searchParams, setTokens, setUser, t]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
      <Loader2 className="text-primary size-10 animate-spin" />
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground text-sm">{t("description")}</p>
      </div>
    </div>
  );
}

export function AuthCallbackContent() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
          <Loader2 className="text-primary size-10 animate-spin" />
        </div>
      }
    >
      <AuthCallbackContentInner />
    </Suspense>
  );
}

export default AuthCallbackContent;
