"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { submitBid } from "@/lib/actions/atelier";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function BidForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(submitBid, null);

  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state?.success, router]);

  return (
    <Card className="border-border/70 bg-card/70">
      <CardHeader>
        <CardTitle className="text-base">Отправить предложение</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="order_id" value={orderId} />
          <div className="space-y-2">
            <Label htmlFor="price">Цена (₽)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min={500}
              required
              placeholder="10000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline">Срок готовности</Label>
            <Input id="deadline" name="deadline" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Комментарий</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Уточнения по ткани, примеркам..."
            />
          </div>
          {state?.error ? (
            <p className="text-sm text-destructive">{state.error}</p>
          ) : null}
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Отправляем..." : "Отправить предложение"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
