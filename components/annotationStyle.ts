import type { AnnotationCategory } from "@/lib/types";

export interface CategoryStyle {
  label: string;
  color: string; // muted, light-card friendly hue (one hue per type)
  tint: string; // faint background for the highlighted span
  underline: "dotted" | "dashed" | "solid" | "double";
  marker?: boolean; // a small ▸ after the span (complex concepts)
}

/**
 * One muted hue per annotation type — colour-coded, but kept calm and on warm
 * paper (the categorical-colour + light-card route the user chose). Deliberately
 * desaturated so the page never gets loud.
 */
export const CATEGORY_STYLE: Record<AnnotationCategory, CategoryStyle> = {
  vocab: { label: "Term", color: "#3E6CA3", tint: "rgba(62,108,163,0.10)", underline: "dotted" },
  "concept-density": { label: "Complex concept", color: "#6E59A5", tint: "rgba(110,89,165,0.12)", underline: "solid", marker: true },
  background: { label: "Background", color: "#3F7A6E", tint: "rgba(63,122,110,0.12)", underline: "dashed" },
  numbers: { label: "By the numbers", color: "#A8743E", tint: "rgba(168,116,62,0.12)", underline: "solid" },
  "argument-role": { label: "Why it matters", color: "#9A5A6B", tint: "rgba(154,90,107,0.12)", underline: "solid" },
};

export function categoryStyle(cat: AnnotationCategory): CategoryStyle {
  return CATEGORY_STYLE[cat] ?? CATEGORY_STYLE.vocab;
}
