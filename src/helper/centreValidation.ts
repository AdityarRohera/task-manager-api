

export function normalizeEnum(value: string, allowed: string[], field: string) {
  const normalized = value.toUpperCase();

  if (!allowed.includes(normalized)) {
    throw new Error(`Invalid ${field}: ${value}`);
  }

  return normalized;
}