"use client";
import React from "react";
import type { Paper, Segment, DomainId } from "@/lib/types";
import { SegmentSpan } from "./SegmentSpan";
import { Badge } from "./ds/Badge";
import { FIGURES } from "@/lib/figures";

/**
 * Magazine layout of the 5% article: a continuous two-column grid (a real
 * multi-column flow) with full-width section heads, original figures and
 * pull-quotes spanning both columns. Same zoomable sentences as the column view.
 */
const PULLQUOTES: Record<string, string> = {
  B: "A blood culture takes eight hours. A septic patient can crash in less.",
  E: "Don't hand me a verdict — tell me which test to run next.",
};

export function MagazineReader({
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
      blocks.push({ sectionId: seg.section, paragraphs: [[seg]] });
      continue;
    }
    if (seg.break) block.paragraphs.push([seg]);
    else block.paragraphs[block.paragraphs.length - 1].push(seg);
  }

  const figuresAfter = (sid: string) => FIGURES.filter((f) => f.after === sid);
  let firstParaDone = false;

  return (
    <div style={{ maxWidth: 1120, width: "100%", margin: "0 auto", padding: "var(--space-8) 32px var(--space-12)", boxSizing: "border-box" }}>
      {/* masthead */}
      <header className="mag-span" style={{ textAlign: "center", marginBottom: "var(--space-8)", paddingBottom: "var(--space-5)", borderBottom: "2px solid var(--text)" }}>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 14, flexWrap: "wrap" }}>
          {paper.meta.badges.map((b, i) => <Badge key={b} tone={i === 0 ? "soft" : "default"}>{b}</Badge>)}
          <Badge tone="soft">Plain · Magazine</Badge>
        </div>
        <h1 className="serif" style={{ fontSize: "var(--text-display)", lineHeight: "var(--leading-tight)", letterSpacing: "var(--tracking-tight)", margin: "0 auto", maxWidth: "20ch", fontWeight: 600 }}>
          {paper.meta.title}
        </h1>
        <p style={{ fontSize: "var(--text-annotation)", color: "var(--text-muted)", margin: "12px 0 0" }}>
          A plain-language retelling · {paper.meta.authors} · {paper.meta.venue}
        </p>
      </header>

      {/* body: each section is a full-width head + a two-column text block,
          with figures / pull-quotes as full-width blocks between sections */}
      <div style={{ fontSize: "var(--text-h3)", lineHeight: 1.7, color: "var(--text)" }}>
        {blocks.map(({ sectionId, paragraphs }) => {
          const section = paper.sections.find((s) => s.id === sectionId)!;
          return (
            <section key={sectionId} style={{ marginBottom: "var(--space-6)" }}>
              <div style={{ marginTop: "var(--space-5)", marginBottom: "var(--space-4)" }}>
                <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 4 }}>{section.eyebrow}</div>
                <h2 style={{ fontSize: "var(--text-h2)", lineHeight: "var(--leading-snug)", margin: 0, fontWeight: "var(--weight-semibold)" }}>
                  {section.heading}
                </h2>
              </div>

              <div className="mag-cols">
                {paragraphs.map((para, pi) => {
                  const dropcap = !firstParaDone;
                  firstParaDone = true;
                  return (
                    <p key={pi} className={`mag-p${dropcap ? " mag-dropcap" : ""}`}>
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
                  );
                })}
              </div>

              {PULLQUOTES[sectionId] && (
                <blockquote className="mag-pullquote">{PULLQUOTES[sectionId]}</blockquote>
              )}

              {figuresAfter(sectionId).map((fig) => (
                <figure key={fig.src} className={`mag-figure${fig.portrait ? " mag-portrait" : ""}`}>
                  <img src={fig.src} alt={`${fig.label}: ${fig.caption}`} />
                  <figcaption className="mag-figcaption">
                    <b>{fig.label}</b> &nbsp;{fig.caption}
                  </figcaption>
                </figure>
              ))}
            </section>
          );
        })}
      </div>

      <p style={{ fontSize: "var(--text-caption)", color: "var(--text-faint)", marginTop: "var(--space-8)", borderTop: "1px solid var(--border)", paddingTop: "var(--space-4)" }}>
        Figures reproduced from the source paper. Click — or pinch — any sentence to zoom into the original with the AI assist layer.
      </p>
    </div>
  );
}
