import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import LoginForm from "./_components/login-form";

export const metadata: Metadata = {
  title: "Đăng nhập | Login",
  description: "Đăng nhập vào hệ thống Social Metrics để quản lý và phân tích số liệu mạng xã hội.",
  robots: {
    index: true,
    follow: false,
  },
  alternates: {
    canonical: "/login",
  },
};

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (token) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
