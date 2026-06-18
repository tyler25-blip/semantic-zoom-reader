"use client";
import React from "react";
import type { Paper, Segment, DomainId } from "@/lib/types";
import { SegmentSpan } from "./SegmentSpan";

/**
 * The 5% layer: the plain-language rewrite, rendered as ONE flowing article
 * (sans, because it's added on top — serif is reserved for the original).
 * Every sentence is its own zoom anchor; click to drill into the original.
 */
export function SkeletonReader({
  paper,
  unfamiliar,
  onOpenSegment,
  onHoverSegment,
  activeSegment,
  flashSegment,
}: {
  paper: Paper;
  unfamiliar: Set<DomainId>;
  onOpenSegment: (id: string, rect: DOMRect) => void;
  onHoverSegment: (id: string | null) => void;
  activeSegment: string | null;
  flashSegment: string | null;
}) {
  // group segments into [section -> paragraphs(segment[])]
  const blocks: { sectionId: string; paragraphs: Segment[][] }[] = [];
  for (const seg of paper.skeleton) {
    let block = blocks[blocks.length - 1];
    if (!block || block.sectionId !== seg.section) {
      block = { sectionId: seg.section, paragraphs: [[seg]] };
      blocks.push(block);
      continue;
    }
    if (seg.break) block.paragraphs.push([seg]);
    else block.paragraphs[block.paragraphs.length - 1].push(seg);
  }

  return (
    <div style={{ maxWidth: 720, width: "100%", margin: "0 auto", padding: "var(--space-8) 24px var(--space-12)", boxSizing: "border-box" }}>
      {blocks.map(({ sectionId, paragraphs }) => {
        const section = paper.sections.find((s) => s.id === sectionId)!;
        return (
          <section key={sectionId} style={{ marginBottom: "var(--space-8)" }}>
            <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 6 }}>{section.eyebrow}</div>
            <h2 style={{ fontSize: "var(--text-h2)", lineHeight: "var(--leading-snug)", margin: "0 0 var(--space-4)", fontWeight: "var(--weight-semibold)" }}>
              {section.heading}
            </h2>
            {paragraphs.map((para, pi) => (
              <p key={pi} style={{ fontSize: "var(--text-h3)", lineHeight: 1.85, color: "var(--text)", margin: "0 0 var(--space-4)", maxWidth: "58ch" }}>
                {para.map((seg) => (
                  <SegmentSpan
                    key={seg.id}
                    seg={seg}
                    active={activeSegment === seg.id}
                    flash={flashSegment === seg.id}
                    hasNotes={!!paper.augment[seg.id]?.annotations?.some((a) => unfamiliar.has(a.domain))}
                    onOpen={(rect) => onOpenSegment(seg.id, rect)}
                    onHover={onHoverSegment}
                  />
                ))}
              </p>
            ))}
          </section>
        );
      })}
    </div>
  );
}
