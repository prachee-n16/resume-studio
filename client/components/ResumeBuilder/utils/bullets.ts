import type { BulletOption } from "@/lib/types";

export type SelectedBullet = { optionId: string; variantId: string };

/**
 * Get the display text for a selected bullet.
 */
export function getBulletText(
  bulletOptions: BulletOption[],
  optionId: string,
  variantId: string
): string {
  const option = bulletOptions.find((o) => o.id === optionId);
  const variant = option?.variants.find((v) => v.id === variantId);
  return variant?.text ?? "";
}

/**
 * Number of variants for an option (for showing "switch variant" only when > 1).
 */
export function getVariantCount(
  bulletOptions: BulletOption[],
  optionId: string
): number {
  const option = bulletOptions.find((o) => o.id === optionId);
  return option?.variants.length ?? 0;
}

/**
 * Cycle to the next variant for the given option in selectedBullets.
 * Returns a new selectedBullets array (immutable).
 */
export function switchSelectedVariant(
  selectedBullets: SelectedBullet[],
  bulletOptions: BulletOption[],
  optionId: string,
  currentVariantId: string
): SelectedBullet[] {
  const option = bulletOptions.find((o) => o.id === optionId);
  if (!option || option.variants.length === 0) return selectedBullets;

  const currentIndex = option.variants.findIndex((v) => v.id === currentVariantId);
  const nextIndex = (currentIndex + 1) % option.variants.length;
  const nextVariantId = option.variants[nextIndex].id;

  return selectedBullets.map((b) =>
    b.optionId === optionId ? { ...b, variantId: nextVariantId } : b
  );
}

/**
 * Remove one bullet from the selected list.
 */
export function removeSelectedBullet(
  selectedBullets: SelectedBullet[],
  optionId: string,
  variantId: string
): SelectedBullet[] {
  return selectedBullets.filter(
    (b) => !(b.optionId === optionId && b.variantId === variantId)
  );
}
