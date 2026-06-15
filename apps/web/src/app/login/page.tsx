import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSellerOnboardingPath } from "@/lib/seller-routing";
import { LoginForm } from "./login-form";

type PageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const { next } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    if (next?.startsWith("/")) {
      redirect(next);
    }
    const atelierPath = await getSellerOnboardingPath();
    if (atelierPath === "/seller/dashboard") {
      redirect("/seller/dashboard");
    }
    redirect("/dashboard");
  }

  return (
    <Suspense fallback={<div className="p-10 text-center">Загрузка...</div>}>
      <LoginForm />
    </Suspense>
  );
}
