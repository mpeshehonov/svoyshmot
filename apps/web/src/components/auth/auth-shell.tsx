import Link from "next/link";
import { APP_NAME } from "@svoyshmot/shared";
import { Scissors } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="mesh-bg flex min-h-full flex-col">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25">
            <Scissors className="size-4" />
          </span>
          <span className="text-lg font-semibold">{APP_NAME}</span>
        </Link>

        <Card className="border-border/70 bg-card/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
      </div>
    </div>
  );
}
