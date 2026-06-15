import { redirect } from "next/navigation";
import { getUserCity } from "@/lib/city";
import { getSellerOnboardingPath } from "@/lib/seller-routing";
import { SellerRegisterForm } from "./seller-register-form";

export default async function SellerRegisterPage() {
  const onboardingPath = await getSellerOnboardingPath();

  if (onboardingPath === "/seller/dashboard") {
    redirect("/seller/dashboard");
  }

  const defaultCity = await getUserCity();
  return <SellerRegisterForm defaultCity={defaultCity} />;
}
