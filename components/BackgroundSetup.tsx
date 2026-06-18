"use client";
import React from "react";
import type { Paper, DomainId } from "@/lib/types";
import { Button } from "./ds/Button";
import { Icon } from "./ds/Icons";

/**
 * After "analysis", the app shows the domains it found in the paper and asks
 * which ones the reader is NOT comfortable with. Those picks decide which 150%
 * notes get pinned inline vs. left as on-demand panels.
 */
export function BackgroundSetup({
  paper,
  selected,
  onToggle,
  onContinue,
  onBack,
}: {
  paper: Paper;
  selected: Set<DomainId>;
  onToggle: (id: DomainId) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "var(--space-6)" }}>
      <div style={{ maxWidth: 640, width: "100%" }}>
        <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", marginBottom: "var(--space-5)", fontSize: "var(--text-caption)" }}>
          <Icon name="arrowLeft" size={15} /> Back
        </button>

        <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 10 }}>Tailor to you</div>
        <h1 style={{ fontSize: "var(--text-h1)", margin: 0, lineHeight: "var(--leading-snug)" }}>
          This paper draws on a few fields. Which are unfamiliar to you?
        </h1>
        <p style={{ color: "var(--text-muted)", margin: "var(--space-3) 0 var(--space-6)" }}>
          Pick any you'd like extra help with. The deeper reading layer will pin notes for these right beside the text — and keep the rest a click away. You can change this anytime.
        </p>

        <div style={{ display: "grid", gap: "var(--space-3)" }}>
          {paper.domains.map((d) => {
            const on = selected.has(d.id);
            return (
              <button
                key={d.id}
                onClick={() => onToggle(d.id)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  textAlign: "left",
                  padding: "16px 18px",
                  borderRadius: "var(--radius-lg)",
                  cursor: "pointer",
                  background: on ? "var(--accent-tint)" : "var(--surface)",
                  border: `1.5px solid ${on ? "var(--accent)" : "var(--border)"}`,
                  transition: "background 150ms ease, border-color 150ms ease",
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 22,
                    height: 22,
                    marginTop: 2,
                    borderRadius: "var(--radius-sm)",
                    border: `1.5px solid ${on ? "var(--accent)" : "var(--border-strong)"}`,
                    background: on ? "var(--accent)" : "transparent",
                    color: "var(--on-accent)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {on && <Icon name="check" size={15} />}
                </span>
                <span>
                  <span style={{ fontWeight: "var(--weight-semibold)", color: "var(--text)" }}>{d.name}</span>
                  <span style={{ display: "block", fontSize: "var(--text-annotation)", color: "var(--text-muted)", marginTop: 2 }}>{d.blurb}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "var(--space-6)" }}>
          <span style={{ fontSize: "var(--text-caption)", color: "var(--text-faint)" }}>
            {selected.size === 0 ? "Nothing selected — you'll get notes on demand only." : `${selected.size} field${selected.size > 1 ? "s" : ""} will get pinned notes.`}
          </span>
          <Button onClick={onContinue} icon={<Icon name="book" size={16} />}>Start reading</Button>
        </div>
      </div>
    </div>
  );
}
