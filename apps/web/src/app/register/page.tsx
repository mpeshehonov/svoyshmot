import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSellerOnboardingPath } from "@/lib/seller-routing";
import { RegisterForm } from "./register-form";

type PageProps = {
  searchParams: Promise<{ role?: string }>;
};

export default async function RegisterPage({ searchParams }: PageProps) {
  const { role } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const atelierPath = await getSellerOnboardingPath();
    if (role === "atelier" || atelierPath === "/seller/register") {
      redirect("/seller/register");
    }
    if (atelierPath === "/seller/dashboard") {
      redirect("/seller/dashboard");
    }
    redirect("/dashboard");
  }

  return <RegisterForm defaultTab={role === "atelier" ? "atelier" : "client"} />;
}
