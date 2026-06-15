import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAtelierOnboardingPath } from "@/lib/atelier-routing";
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
    const atelierPath = await getAtelierOnboardingPath();
    if (role === "atelier" || atelierPath === "/atelier/register") {
      redirect("/atelier/register");
    }
    if (atelierPath === "/atelier/dashboard") {
      redirect("/atelier/dashboard");
    }
    redirect("/dashboard");
  }

  return <RegisterForm defaultTab={role === "atelier" ? "atelier" : "client"} />;
}
