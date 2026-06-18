import React from "react";
import type { DifficultyTag } from "@/lib/types";

const DOMAINS = new Set(["clinical", "ml", "hci", "stats"]);

export function difficultyLevel(tags: DifficultyTag[]): 1 | 2 | 3 {
  if (tags.includes("concept-density") || tags.includes("numbers")) return 3;
  if (tags.some((t) => DOMAINS.has(t)) || tags.includes("vocab") || tags.includes("background")) return 2;
  return 1;
}

/** A quiet "signal strength" mark: how much depth waits behind this sentence. */
export function DifficultyIndicator({ tags, hasNotes }: { tags: DifficultyTag[]; hasNotes?: boolean }) {
  const level = difficultyLevel(tags);
  return (
    <span
      aria-hidden
      style={{ display: "inline-flex", alignItems: "flex-end", gap: 2, marginLeft: 6, verticalAlign: "middle", height: "0.9em" }}
      title={tags.join(" · ")}
    >
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          style={{
            width: 3,
            height: `${i * 3 + 2}px`,
            borderRadius: 1,
            background: i <= level ? "var(--accent-soft)" : "var(--border-strong)",
            opacity: i <= level ? 1 : 0.5,
          }}
        />
      ))}
      {hasNotes && (
        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)", marginLeft: 2, marginBottom: 1 }} />
      )}
    </span>
  );
}
