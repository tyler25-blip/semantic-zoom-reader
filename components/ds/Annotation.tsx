"use client";
import React from "react";
import type { Annotation as Ann, Domain } from "@/lib/types";
import { Icon } from "./Icons";
import { NumberVisual } from "../NumberVisual";
import { categoryStyle } from "../annotationStyle";

/**
 * Annotation — the rich explanation card (sans), colour-coded by category.
 * Light/warm card per the design system (no dark tooltip). Left border + eyebrow
 * take the category hue. Structure: category tag → plain gist → optional concrete
 * example ("E.g. … → takeaway") → optional number figure.
 */
export function Annotation({
  ann,
  domains,
  onClose,
  style = {},
  width = 320,
}: {
  ann: Ann;
  domains: Domain[];
  onClose?: () => void;
  style?: React.CSSProperties;
  width?: number;
}) {
  const domain = domains.find((d) => d.id === ann.domain);
  const s = categoryStyle(ann.category);

  return (
    <div
      role="note"
      style={{
        fontFamily: "var(--font-sans)",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderLeft: `3px solid ${s.color}`,
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-lg)",
        padding: "13px 15px",
        width,
        maxWidth: "min(360px, 80vw)",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
        <span className="eyebrow" style={{ color: s.color }}>
          {s.label}
          {ann.example ? " · example" : ""}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {domain && <span style={{ fontSize: "var(--text-caption)", color: "var(--text-faint)" }}>{domain.name}</span>}
          {onClose && (
            <button onClick={onClose} aria-label="Close" style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-faint)", padding: 0, display: "inline-flex" }}>
              <Icon name="x" size={15} />
            </button>
          )}
        </span>
      </div>

      <div style={{ fontSize: "var(--text-annotation)", fontWeight: "var(--weight-medium)", color: "var(--text)", marginBottom: 4 }}>
        “{ann.anchor}”
      </div>

      <div style={{ fontSize: "var(--text-annotation)", lineHeight: "var(--leading-normal)", color: "var(--text-muted)" }}>
        {ann.content}
      </div>

      {ann.example && (
        <div
          style={{
            marginTop: 10,
            paddingLeft: 10,
            borderLeft: `2px solid ${s.color}`,
            fontSize: "var(--text-annotation)",
            lineHeight: "var(--leading-normal)",
            color: "var(--text-muted)",
            fontStyle: "italic",
          }}
        >
          {ann.example}
        </div>
      )}

      {ann.viz && <NumberVisual viz={ann.viz} />}
    </div>
  );
}
