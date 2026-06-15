"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { sendMessage } from "@/lib/actions/messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
  id: string;
  text: string;
  created_at: string;
  sender_id: string;
  profiles?: { name: string | null } | null;
};

export function OrderChat({
  orderId,
  initialMessages,
  currentUserId,
}: {
  orderId: string;
  initialMessages: Message[];
  currentUserId: string;
}) {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [state, formAction, pending] = useActionState(sendMessage, null);

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state?.success, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [initialMessages.length]);

  return (
    <div className="glass-panel rounded-2xl p-4">
      <h3 className="mb-4 font-medium">Чат по заказу</h3>
      <div className="mb-4 max-h-80 space-y-3 overflow-y-auto pr-1">
        {initialMessages.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Сообщений пока нет. Напишите первым.
          </p>
        ) : (
          initialMessages.map((message) => {
            const mine = message.sender_id === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    mine
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <p>{message.text}</p>
                  <p className="mt-1 text-[10px] opacity-70">
                    {new Date(message.created_at).toLocaleString("ru-RU")}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form action={formAction} className="flex gap-2">
        <input type="hidden" name="order_id" value={orderId} />
        <Input
          name="text"
          placeholder="Напишите сообщение..."
          autoComplete="off"
          required
          maxLength={2000}
        />
        <Button type="submit" disabled={pending}>
          {pending ? "..." : "Отпр."}
        </Button>
      </form>
      {state?.error ? (
        <p className="mt-2 text-sm text-destructive">{state.error}</p>
      ) : null}
    </div>
  );
}
