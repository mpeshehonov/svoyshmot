import { getUserCity } from "@/lib/city";
import { AtelierRegisterForm } from "./atelier-register-form";

export default async function AtelierRegisterPage() {
  const defaultCity = await getUserCity();
  return <AtelierRegisterForm defaultCity={defaultCity} />;
}
