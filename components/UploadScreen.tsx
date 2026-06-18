"use client";
import React from "react";
import type { Paper } from "@/lib/types";
import { Button } from "./ds/Button";
import { Badge } from "./ds/Badge";
import { Icon } from "./ds/Icons";

/** Mock upload. In the prototype it just loads the pre-generated sample paper. */
export function UploadScreen({ paper, onStart }: { paper: Paper; onStart: () => void }) {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "var(--space-6)" }}>
      <div style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>
        <div style={{ display: "inline-flex", marginBottom: "var(--space-5)", color: "var(--accent)" }}>
          <Icon name="layers" size={40} />
        </div>
        <h1 style={{ fontSize: "var(--text-display)", lineHeight: "var(--leading-tight)", letterSpacing: "var(--tracking-tight)", margin: 0 }}>
          Semantic Zoom Reading
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "var(--text-h3)", margin: "var(--space-3) 0 var(--space-6)", lineHeight: "var(--leading-normal)" }}>
          Read any paper at the depth you want — from a plain-language skeleton, down to the original with an AI assist layer.
        </p>

        <label
          style={{
            display: "block",
            border: "1.5px dashed var(--border-strong)",
            borderRadius: "var(--radius-xl)",
            background: "var(--surface)",
            padding: "var(--space-8) var(--space-6)",
            cursor: "pointer",
          }}
          onClick={onStart}
        >
          <div style={{ display: "inline-flex", color: "var(--text-faint)", marginBottom: "var(--space-3)" }}>
            <Icon name="upload" size={28} />
          </div>
          <div style={{ fontWeight: "var(--weight-medium)" }}>Drop a PDF, or click to upload</div>
          <div style={{ fontSize: "var(--text-caption)", color: "var(--text-faint)", marginTop: 4 }}>
            Prototype: loads a pre-analysed sample paper
          </div>
        </label>

        <div style={{ marginTop: "var(--space-6)", padding: "var(--space-5)", background: "var(--surface-sunken)", borderRadius: "var(--radius-lg)", textAlign: "left" }}>
          <div className="eyebrow" style={{ color: "var(--text-muted)", marginBottom: 8 }}>Sample loaded</div>
          <div className="serif" style={{ fontSize: "var(--text-h3)", lineHeight: "var(--leading-snug)" }}>{paper.meta.title}</div>
          <div style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)", marginTop: 6 }}>{paper.meta.authors} · {paper.meta.venue}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            {paper.meta.badges.map((b, i) => (
              <Badge key={b} tone={i === 0 ? "soft" : "default"}>{b}</Badge>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "var(--space-6)" }}>
          <Button size="md" onClick={onStart} icon={<Icon name="chevronRight" size={16} />}>
            Analyse this paper
          </Button>
        </div>
      </div>
    </div>
  );
}
