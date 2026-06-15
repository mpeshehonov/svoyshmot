export function relationOne<T extends Record<string, unknown>>(
  value: unknown,
): T | null {
  if (!value) return null;
  if (Array.isArray(value)) return (value[0] as T | undefined) ?? null;
  return value as T;
}

export function designPrompt(designs: unknown): string {
  return relationOne<{ prompt?: string }>(designs)?.prompt ?? "Дизайн";
}
