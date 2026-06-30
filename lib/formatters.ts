export function formatPrice(price: number): string {
  return `₹${Math.round(price)}`;
}

export function formatWeight(weight: string): string {
  if (/^\d+$/.test(weight)) {
    return `${weight}g`;
  }
  return weight;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
