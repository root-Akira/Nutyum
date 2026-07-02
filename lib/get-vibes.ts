import { VIBE_TAGS } from "@/types";

const STORAGE_URL =
  "https://jemypvfnlazkrvrmzcaz.supabase.co/storage/v1/object/public/product-images/config/vibes.json";

export async function getVibes(): Promise<string[]> {
  try {
    const res = await fetch(STORAGE_URL);
    if (!res.ok) return [...VIBE_TAGS];
    const data: unknown = await res.json();
    if (Array.isArray(data) && data.length) return data as string[];
    return [...VIBE_TAGS];
  } catch {
    return [...VIBE_TAGS];
  }
}
