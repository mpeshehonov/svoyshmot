import { redirect } from "next/navigation";
import { getUserCity } from "@/lib/city";
import { getAtelierOnboardingPath } from "@/lib/atelier-routing";
import { AtelierRegisterForm } from "./atelier-register-form";

export default async function AtelierRegisterPage() {
  const onboardingPath = await getAtelierOnboardingPath();

  if (onboardingPath === "/atelier/dashboard") {
    redirect("/atelier/dashboard");
  }

  const defaultCity = await getUserCity();
  return <AtelierRegisterForm defaultCity={defaultCity} />;
}
