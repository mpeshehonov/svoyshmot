import { Palette, Scissors, Store, Wand2 } from "lucide-react";
import { SELLER_COPY } from "@svoyshmot/shared";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: Wand2,
    title: "Опиши идею",
    description:
      "Текстом или референсами — ИИ предложит несколько вариантов дизайна.",
  },
  {
    icon: Palette,
    title: "Настрой детали",
    description: "Ткань, цвет, размер и посадку — всё в одном заказе.",
  },
  {
    icon: Store,
    title: `Выбери ${SELLER_COPY.ofOne}`,
    description: "Сравни цену, срок и рейтинг. Откликнутся подходящие мастерские и бренды.",
  },
  {
    icon: Scissors,
    title: "Получи свой шмот",
    description: "Статусы и чат внутри платформы — без бесконечных звонков.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Процесс
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">
          От промпта до пошива за 4 шага
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <Card
              key={step.title}
              className="border-border/70 bg-card/60 backdrop-blur-sm"
            >
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/20">
                    <step.icon className="size-5" />
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
