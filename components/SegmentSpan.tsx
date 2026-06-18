"use client";
import React from "react";
import type { Segment } from "@/lib/types";
import { DifficultyIndicator } from "./DifficultyIndicator";
import { Icon } from "./ds/Icons";

/** One zoomable sentence of the 5% article — shared by both reading layouts. */
export function SegmentSpan({
  seg,
  active,
  flash,
  hasNotes,
  onOpen,
  onHover,
}: {
  seg: Segment;
  active: boolean;
  flash?: boolean; // briefly pulse + scroll into view after zooming back out
  hasNotes: boolean;
  onOpen: (rect: DOMRect) => void;
  onHover: (id: string | null) => void;
}) {
  const [hover, setHover] = React.useState(false);
  const ref = React.useRef<HTMLSpanElement>(null);

  // when we return from a zoom, bring the originating sentence back into view
  React.useEffect(() => {
    if (flash && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [flash]);

  return (
    <span
      ref={ref}
      className={flash ? "seg-flash" : undefined}
      onClick={() => ref.current && onOpen(ref.current.getBoundingClientRect())}
      onMouseEnter={() => { setHover(true); onHover(seg.id); }}
      onMouseLeave={() => { setHover(false); onHover(null); }}
      style={{
        cursor: "zoom-in",
        background: active || hover ? "var(--accent-tint)" : "transparent",
        borderRadius: "var(--radius-sm)",
        boxShadow: hover ? "inset 0 -0.08em 0 var(--accent-soft)" : "none",
        padding: "0.06em 0.04em",
        transition: "background 130ms ease",
      }}
    >
      {seg.text}
      <DifficultyIndicator tags={seg.tags} hasNotes={hasNotes} />
      {hover && (
        <span style={{ display: "inline-flex", verticalAlign: "middle", color: "var(--accent)", marginLeft: 3 }}>
          <Icon name="zoomIn" size={14} />
        </span>
      )}{" "}
    </span>
  );
}
