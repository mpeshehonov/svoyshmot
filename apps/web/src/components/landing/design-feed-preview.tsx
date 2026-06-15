import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const feedItems = [
  {
    title: "Cyber hoodie",
    author: "анна_k",
    likes: 128,
    gradient: "from-fuchsia-500/30 via-violet-600/20 to-slate-900",
    tag: "streetwear",
  },
  {
    title: "Linen midi",
    author: "dmitry.s",
    likes: 94,
    gradient: "from-amber-200/20 via-rose-300/15 to-slate-900",
    tag: "minimal",
  },
  {
    title: "Denim crop",
    author: "mila_v",
    likes: 201,
    gradient: "from-sky-400/20 via-indigo-500/20 to-slate-900",
    tag: "custom",
  },
  {
    title: "Neo trench",
    author: "kira",
    likes: 76,
    gradient: "from-emerald-400/15 via-cyan-500/15 to-slate-900",
    tag: "outerwear",
  },
];

export function DesignFeedPreview() {
  return (
    <section id="feed" className="border-y border-border/60 bg-card/30 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Соцлента
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Вдохновляйся и шерь свои луки
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Pinterest + Dribbble для одежды: лайки, сохранения, подписки —
            скоро в MVP.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {feedItems.map((item) => (
            <Card
              key={item.title}
              className="group overflow-hidden border-border/70 bg-card/80 transition hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div
                className={`relative aspect-[4/5] bg-gradient-to-br ${item.gradient}`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_45%)]" />
                <Badge className="absolute left-3 top-3 bg-background/70 text-foreground backdrop-blur">
                  {item.tag}
                </Badge>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-4 pt-16">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">@{item.author}</p>
                </div>
              </div>
              <CardContent className="flex items-center justify-between py-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Heart className="size-4 text-primary" />
                  {item.likes}
                </span>
                <span className="inline-flex items-center gap-3 opacity-0 transition group-hover:opacity-100">
                  <MessageCircle className="size-4" />
                  <Share2 className="size-4" />
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
