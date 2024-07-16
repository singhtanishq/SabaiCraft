import type { ProductVariant } from '@app-types';

/** Backend stores variant attributes as a JSON string; normalize to an object. */
export function parseVariantAttributes(raw: unknown): Record<string, string> {
  if (raw && typeof raw === 'object') return raw as Record<string, string>;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }
  return {};
}

/** Normalize a backend variant payload into the frontend ProductVariant shape. */
export function normalizeVariant(v: any): ProductVariant {
  return {
    id: v.id,
    name: v.name,
    sku: v.sku,
    price: v.price,
    compareAtPrice: v.compareAtPrice ?? undefined,
    inventory: v.inventory ?? 0,
    image: v.image ?? undefined,
    attributes: parseVariantAttributes(v.attributes),
  };
}
