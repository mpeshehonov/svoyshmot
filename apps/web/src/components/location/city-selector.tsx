"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LocateFixed, MapPin } from "lucide-react";
import { PREDEFINED_CITIES } from "@svoyshmot/shared";
import { detectCityFromCoordinates, setUserCity } from "@/lib/actions/city";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export function CitySelector({ currentCity }: { currentCity: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [detecting, setDetecting] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...PREDEFINED_CITIES];
    return PREDEFINED_CITIES.filter((c) => c.toLowerCase().includes(q));
  }, [query]);

  function applyCity(city: string) {
    setError(null);
    startTransition(async () => {
      const result = await setUserCity(city);
      if (result.error) {
        setError(result.error);
        return;
      }
      setOpen(false);
      setQuery("");
      setCustomCity("");
      router.refresh();
    });
  }

  function handleDetect() {
    if (!navigator.geolocation) {
      setError("Браузер не поддерживает геолокацию");
      return;
    }

    setDetecting(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        startTransition(async () => {
          const result = await detectCityFromCoordinates(
            position.coords.latitude,
            position.coords.longitude,
          );
          setDetecting(false);
          if (result.error) {
            setError(result.error);
            return;
          }
          setOpen(false);
          router.refresh();
        });
      },
      () => {
        setDetecting(false);
        setError("Разрешите доступ к геолокации или выберите город вручную");
      },
      { enableHighAccuracy: false, timeout: 12_000, maximumAge: 300_000 },
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="max-w-[9.5rem] gap-1.5 truncate border-border/70 bg-background/60"
          disabled={pending || detecting}
        >
          {pending || detecting ? (
            <Loader2 className="size-3.5 shrink-0 animate-spin" />
          ) : (
            <MapPin className="size-3.5 shrink-0 text-primary" />
          )}
          <span className="truncate">{currentCity}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Город пошива
        </DropdownMenuLabel>
        <div className="px-2 pb-2">
          <Input
            placeholder="Поиск..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8"
          />
        </div>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            handleDetect();
          }}
          className="gap-2"
        >
          <LocateFixed className="size-4" />
          Определить автоматически
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="max-h-48 overflow-y-auto">
          {filtered.map((city) => (
            <DropdownMenuItem
              key={city}
              onSelect={() => applyCity(city)}
              className={city === currentCity ? "bg-accent" : undefined}
            >
              {city}
            </DropdownMenuItem>
          ))}
          {filtered.length === 0 ? (
            <p className="px-2 py-1.5 text-xs text-muted-foreground">
              Нет в списке — введите ниже
            </p>
          ) : null}
        </div>
        <DropdownMenuSeparator />
        <div className="space-y-2 p-2">
          <p className="text-xs text-muted-foreground">Другой город</p>
          <div className="flex gap-1">
            <Input
              placeholder="Например, Туапсе"
              value={customCity}
              onChange={(e) => setCustomCity(e.target.value)}
              className="h-8"
              onKeyDown={(e) => {
                if (e.key === "Enter" && customCity.trim()) {
                  e.preventDefault();
                  applyCity(customCity);
                }
              }}
            />
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="shrink-0"
              disabled={!customCity.trim() || pending}
              onClick={() => applyCity(customCity)}
            >
              OK
            </Button>
          </div>
        </div>
        {error ? (
          <p className="px-2 pb-2 text-xs text-destructive">{error}</p>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
