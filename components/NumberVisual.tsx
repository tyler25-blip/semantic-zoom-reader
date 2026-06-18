import React from "react";
import type { NumberViz } from "@/lib/types";

/** Turns a dense statistic into a quiet, single-accent picture. No second hue. */
export function NumberVisual({ viz }: { viz: NumberViz }) {
  const dots = Array.from({ length: viz.total });
  return (
    <div style={{ marginTop: 10 }}>
      {viz.type === "dots" && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, maxWidth: 220 }}>
          {dots.map((_, i) => (
            <span
              key={i}
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: i < viz.filled ? "var(--accent-soft)" : "transparent",
                border: `1.5px solid ${i < viz.filled ? "var(--accent-soft)" : "var(--border-strong)"}`,
              }}
            />
          ))}
        </div>
      )}

      {viz.type === "fraction" && (
        <div style={{ display: "flex", height: 10, borderRadius: "var(--radius-full)", overflow: "hidden", background: "var(--surface-sunken)", maxWidth: 220 }}>
          <div style={{ width: `${(viz.filled / viz.total) * 100}%`, background: "var(--accent)" }} />
        </div>
      )}

      <div style={{ marginTop: 6, fontSize: "var(--text-caption)", color: "var(--text-faint)" }}>{viz.label}</div>
    </div>
  );
}
