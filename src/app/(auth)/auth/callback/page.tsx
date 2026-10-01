import type { Metadata } from "next";

import { AuthCallbackContent } from "./_components/auth";

export const metadata: Metadata = {
  title: "Đang xác thực tài khoản...",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthCallbackPage() {
  return <AuthCallbackContent />;
}
