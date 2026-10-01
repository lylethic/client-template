import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import RegisterForm from "./_components/register-form";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản | Register",
  description:
    "Tạo tài khoản Social Metrics mới để bắt đầu kết nối các nền tảng mạng xã hội và theo dõi tăng trưởng.",
  robots: {
    index: true,
    follow: false,
  },
  alternates: {
    canonical: "/register",
  },
};

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (token) {
    redirect("/dashboard");
  }

  return <RegisterForm />;
}
