/**
 * Generate a collision-safe ID with an optional prefix.
 * Uses crypto.randomUUID() for stability across fast creates and multiple clients.
 */
export function generateId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}
