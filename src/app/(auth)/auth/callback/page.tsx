"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/stores/auth.store";
import { getMe } from "@/modules/auth/auth.service";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTokens, setUser } = useAuthStore();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const error = searchParams.get("error");
    if (error) {
      toast.error(`Đăng nhập Google thất bại: ${error}`);
      router.replace("/login");
      return;
    }

    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (!accessToken || !refreshToken) {
      toast.error("Không tìm thấy thông tin xác thực từ Google.");
      router.replace("/login");
      return;
    }

    const completeLogin = async () => {
      try {
        setTokens(accessToken, refreshToken);
        const user = await getMe();
        setUser(user, accessToken);
        toast.success("Đăng nhập bằng Google thành công!");
        router.replace(user.is_superuser ? "/admin" : "/dashboard");
      } catch {
        toast.error("Xảy ra lỗi khi tải thông tin tài khoản.");
        router.replace("/login");
      }
    };

    void completeLogin();
  }, [router, searchParams, setTokens, setUser]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
      <Loader2 className="text-primary size-10 animate-spin" />
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">Đang xác thực tài khoản Google...</h2>
        <p className="text-muted-foreground text-sm">Vui lòng đợi trong giây lát.</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
          <Loader2 className="text-primary size-10 animate-spin" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
