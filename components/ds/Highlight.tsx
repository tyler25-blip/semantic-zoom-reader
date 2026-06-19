"use client";
import React from "react";
import type { AnnotationCategory } from "@/lib/types";
import { categoryStyle } from "../annotationStyle";

/**
 * Highlight — marks an explainable span in the original (serif) text.
 * Type is colour-coded: one muted hue + underline style per annotation category,
 * so the reader can see at a glance what's annotatable and which kind. The mark
 * sits under the text (no overlay), so it never obscures the words.
 */
export function Highlight({
  children,
  category,
  active = false,
  pinned = false,
  dim = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  innerRef,
}: {
  children: React.ReactNode;
  category: AnnotationCategory;
  active?: boolean;
  pinned?: boolean;
  dim?: boolean; // "hide annotations" peek → render as plain text
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  innerRef?: React.Ref<HTMLElement>;
}) {
  const s = categoryStyle(category);

  if (dim) {
    return <span ref={innerRef as React.Ref<HTMLSpanElement>}>{children}</span>;
  }

  return (
    <mark
      ref={innerRef as React.Ref<HTMLElement>}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        background: active ? s.tint : "transparent",
        color: "inherit",
        borderRadius: "var(--radius-sm)",
        padding: "0.02em 0.06em",
        margin: "0 -0.04em",
        textDecoration: `underline ${s.underline} ${s.color}`,
        textDecorationThickness: pinned ? "2px" : "1.5px",
        textUnderlineOffset: "0.22em",
        cursor: "pointer",
        transition: "background 140ms ease",
      }}
    >
      {children}
      {s.marker && (
        <span style={{ color: s.color, fontSize: "0.7em", verticalAlign: "super", marginLeft: 1 }}>▸</span>
      )}
    </mark>
  );
}
