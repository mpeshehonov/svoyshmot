import { Suspense } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { CreateDesignForm } from "./create-design-form";

export default function CreatePage() {
  return (
    <div className="min-h-full">
      <SiteHeader />
      <Suspense
        fallback={
          <div className="p-10 text-center text-muted-foreground">Загрузка...</div>
        }
      >
        <CreateDesignForm />
      </Suspense>
    </div>
  );
}
