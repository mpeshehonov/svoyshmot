"use client";

import Link from "next/link";
import { LayoutDashboard, LogOut, Plus, User } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeaderUser({
  name,
  role,
}: {
  name: string;
  role?: "client" | "atelier" | "admin";
}) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" className="hidden sm:inline-flex" asChild>
        <Link href={role === "atelier" ? "/atelier/dashboard" : "/create"}>
          <Plus className="size-4" />
          {role === "atelier" ? "Заказы" : "Создать"}
        </Link>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full">
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary/15 text-xs text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href={role === "atelier" ? "/atelier/dashboard" : "/dashboard"}>
              <LayoutDashboard className="size-4" />
              Кабинет
            </Link>
          </DropdownMenuItem>
          {role === "atelier" ? null : (
            <DropdownMenuItem asChild>
              <Link href="/create">
                <Plus className="size-4" />
                Новый дизайн
              </Link>
            </DropdownMenuItem>
          )}
          {role === "atelier" ? null : (
            <DropdownMenuItem asChild>
              <Link href="/atelier/register">
                <LayoutDashboard className="size-4" />
                Стать ателье
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            <User className="size-4" />
            {name}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <form action={signOut}>
            <DropdownMenuItem asChild variant="destructive">
              <button type="submit" className="w-full cursor-pointer">
                <LogOut className="size-4" />
                Выйти
              </button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
