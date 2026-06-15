import Link from "next/link";
import { APP_NAME, SELLER_COPY } from "@svoyshmot/shared";
import { SiteHeader } from "@/components/layout/site-header";
import { DesignFeedPreview } from "@/components/landing/design-feed-preview";
import { HeroPrompt } from "@/components/landing/hero-prompt";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-full">
      <SiteHeader />
      <main>
        <HeroPrompt />
        <HowItWorks />
        <DesignFeedPreview />

        <section className="px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl rounded-3xl border border-dashed border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card p-8 sm:p-12">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              {SELLER_COPY.landingTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {SELLER_COPY.landingLead} {SELLER_COPY.typesHint}
            </p>
            <Button className="mt-6" variant="secondary" asChild>
              <Link href="/atelier">{SELLER_COPY.become}</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>{APP_NAME}</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
