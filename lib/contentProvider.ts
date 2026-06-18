// The seam. Today this returns pre-generated static content (Wizard of Oz).
// To go live, swap the import for an API/LLM call that returns the same Paper shape.
import paper from "@/data/paper.json";
import type { Paper, OriginalParagraph, Augment } from "./types";

export function getPaper(): Paper {
  return paper as Paper;
}

export function getOriginal(id: string): OriginalParagraph | undefined {
  return getPaper().original.find((p) => p.id === id);
}

export function getAugment(segmentId: string): Augment | undefined {
  return getPaper().augment[segmentId];
}
