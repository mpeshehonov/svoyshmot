import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Куда направить пользователя в контексте онбординга продавца */
export async function getAtelierOnboardingPath(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: atelier } = await supabase
    .from("ateliers")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (atelier) return "/atelier/dashboard";

  return "/atelier/register";
}
