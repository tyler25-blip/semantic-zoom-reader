"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Paper, DomainId, Annotation as Ann, OriginalParagraph } from "@/lib/types";
import { Highlight } from "./ds/Highlight";
import { Annotation } from "./ds/Annotation";
import { Icon } from "./ds/Icons";
import type { ZoomLevel } from "./Reader";

interface Match { annId: string; anchor: string; start: number; len: number; }

function matchAnchors(text: string, anns: Ann[], used: Set<string>): Match[] {
  const found: Match[] = [];
  for (const a of anns) {
    if (used.has(a.id)) continue;
    const idx = text.indexOf(a.anchor);
    if (idx >= 0) found.push({ annId: a.id, anchor: a.anchor, start: idx, len: a.anchor.length });
  }
  found.sort((m, n) => m.start - n.start);
  const out: Match[] = [];
  let cursor = -1;
  for (const m of found) {
    if (m.start < cursor) continue;
    out.push(m);
    used.add(m.annId);
    cursor = m.start + m.len;
  }
  return out;
}

export function ZoomLayer({
  paper,
  unfamiliar,
  segmentId,
  level,
  originRect,
  onZoomIn,
  onZoomOut,
  onClose,
}: {
  paper: Paper;
  unfamiliar: Set<DomainId>;
  segmentId: string;
  level: ZoomLevel; // "augmented" = 150%, "original" = clean 100%
  originRect: DOMRect | null;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onClose: () => void;
}) {
  const segment = paper.skeleton.find((s) => s.id === segmentId)!;
  const sources: OriginalParagraph[] = segment.source
    .map((id) => paper.original.find((p) => p.id === id))
    .filter(Boolean) as OriginalParagraph[];
  // Only surface notes for the fields the reader marked as unfamiliar.
  const allAnns: Ann[] = paper.augment[segmentId]?.annotations ?? [];
  const anns: Ann[] = allAnns.filter((a) => unfamiliar.has(a.domain));
  const isPinned = (_a: Ann) => true; // everything shown is, by definition, a flagged field

  const [hideNotes, setHideNotes] = React.useState(false);
  const [openAnn, setOpenAnn] = React.useState<string | null>(null);
  const [cardPos, setCardPos] = React.useState<{ top: number; left: number } | null>(null);

  const colRef = React.useRef<HTMLDivElement>(null);
  const anchorRefs = React.useRef<Record<string, HTMLElement | null>>({});

  const showNotes = level === "augmented" && !hideNotes;

  const used = new Set<string>();
  const paraMatches = sources.map((p) => matchAnchors(p.text, anns, used));

  const positionCard = (annId: string) => {
    const el = anchorRefs.current[annId];
    const col = colRef.current;
    if (!el || !col) return;
    const er = el.getBoundingClientRect();
    const cr = col.getBoundingClientRect();
    const cardW = 320;
    let left = er.left - cr.left;
    left = Math.max(0, Math.min(left, col.clientWidth - cardW));
    setCardPos({ top: er.bottom - cr.top + 8, left });
  };

  const openCard = (annId: string) => {
    setOpenAnn(annId);
    requestAnimationFrame(() => positionCard(annId));
  };

  const openAnnObj = openAnn ? anns.find((a) => a.id === openAnn) ?? null : null;
  const depth = level === "augmented" ? "150%" : "100%";

  // The card grows out of the clicked sentence and collapses back into it.
  const origin = React.useMemo(() => {
    if (!originRect || typeof window === "undefined") return { x: 0, y: 24, s: 0.9 };
    const ox = originRect.left + originRect.width / 2;
    const oy = originRect.top + originRect.height / 2;
    return {
      x: (ox - window.innerWidth / 2) * 0.4,
      y: (oy - window.innerHeight / 2) * 0.4,
      s: 0.62,
    };
  }, [originRect]);
  const silk = [0.22, 1, 0.36, 1] as const; // easeOutQuint — smooth, no bounce

  return (
    <motion.div
      initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1 }}
      transition={{ duration: 0.36 }}
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", flexDirection: "column" }}
    >
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: silk }}
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(20,22,26,0.45)", backdropFilter: "blur(1.5px)" }}
      />

      <motion.div
        initial={{ opacity: 0, scale: origin.s, x: origin.x, y: origin.y }}
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, scale: origin.s, x: origin.x, y: origin.y }}
        transition={{ duration: 0.36, ease: silk }}
        style={{
          position: "relative", margin: "auto", marginTop: "5vh", marginBottom: "5vh",
          width: "min(820px, 94vw)", maxHeight: "90vh", display: "flex", flexDirection: "column",
          background: "var(--surface)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--border)", overflow: "hidden",
        }}
      >
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <DepthLadder depth={depth} />
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {level === "augmented" && (
              <ZoomBtn label={hideNotes ? "Show notes" : "Hide notes (peek clean)"} icon={hideNotes ? "sparkles" : "fileText"} onClick={() => setHideNotes((v) => !v)} active={hideNotes} />
            )}
            <span style={{ width: 1, height: 22, background: "var(--border)", margin: "0 2px" }} />
            <ZoomBtn label="Zoom out" icon="zoomOut" onClick={onZoomOut} />
            <ZoomBtn label={level === "augmented" ? "Zoom in to clean original" : "Deepest"} icon="zoomIn" onClick={onZoomIn} disabled={level === "original"} primary={level === "augmented"} />
            <span style={{ width: 1, height: 22, background: "var(--border)", margin: "0 2px" }} />
            <ZoomBtn label="Close" icon="x" onClick={onClose} />
          </div>
        </div>

        {/* body */}
        <div style={{ position: "relative", overflow: "auto", padding: "24px 26px 36px" }} onClick={() => setOpenAnn(null)}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span className="eyebrow" style={{ color: "var(--text-muted)" }}>
              Original · {sources.map((s) => s.label).join(" + ")}
            </span>
            <span className="eyebrow" style={{ color: showNotes ? "var(--accent)" : "var(--text-faint)" }}>
              {level === "augmented" ? (hideNotes ? "Notes hidden" : "Assist layer on") : "Clean original"}
            </span>
          </div>

          {showNotes && anns.length === 0 && (
            <div style={{ marginBottom: 14, padding: "10px 13px", background: "var(--surface-sunken)", borderRadius: "var(--radius-md)", fontSize: "var(--text-annotation)", color: "var(--text-muted)", display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ color: "var(--accent-soft)", display: "inline-flex" }}><Icon name="sparkles" size={16} /></span>
              {allAnns.length === 0
                ? "Nothing flagged here — the original reads straight."
                : "No terms here from the fields you marked unfamiliar. Add fields in settings to see more."}
            </div>
          )}

          <div ref={colRef} style={{ position: "relative" }}>
            <div className="serif" style={{ fontSize: "var(--text-read)", lineHeight: 2.0, color: "var(--text)", maxWidth: "64ch" }}>
              {sources.map((p, pi) => (
                <p key={p.id} style={{ margin: pi === 0 ? "0 0 1em" : "0 0 1em" }}>
                  {showNotes
                    ? renderHighlighted(p.text, paraMatches[pi], anns, {
                        openAnn, unfamiliar, isPinned, openCard,
                        refFn: (id, el) => (anchorRefs.current[id] = el),
                        domains: paper.domains,
                      })
                    : p.text}
                </p>
              ))}
            </div>

            {/* floating rich card, anchored beside its term */}
            <AnimatePresence>
              {showNotes && openAnnObj && cardPos && (
                <motion.div
                  key={openAnnObj.id}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.13 }}
                  onClick={(e) => e.stopPropagation()}
                  style={{ position: "absolute", top: cardPos.top, left: cardPos.left, zIndex: 5 }}
                >
                  <Annotation ann={openAnnObj} domains={paper.domains} onClose={() => setOpenAnn(null)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* footer */}
        <div style={{ flexShrink: 0, borderTop: "1px solid var(--border)", padding: "9px 18px", fontSize: "var(--text-caption)", color: "var(--text-faint)", display: "flex", justifyContent: "space-between", gap: 12 }}>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>5% retold this as: “{truncate(segment.text, 58)}”</span>
          <span style={{ whiteSpace: "nowrap" }}>pinch / +−/ Esc</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ----- rendering ----- */

function renderHighlighted(
  text: string,
  matches: Match[],
  anns: Ann[],
  opts: {
    openAnn: string | null;
    unfamiliar: Set<DomainId>;
    isPinned: (a: Ann) => boolean;
    openCard: (id: string) => void;
    refFn: (id: string, el: HTMLElement | null) => void;
    domains: Paper["domains"];
  }
): React.ReactNode {
  if (!matches.length) return text;
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  matches.forEach((m, i) => {
    if (m.start > cursor) nodes.push(text.slice(cursor, m.start));
    const a = anns.find((x) => x.id === m.annId)!;
    const pinned = opts.isPinned(a);
    nodes.push(
      <Highlight
        key={`${m.annId}-${i}`}
        category={a.category}
        active={opts.openAnn === m.annId}
        pinned={pinned}
        innerRef={(el: HTMLElement | null) => opts.refFn(m.annId, el)}
        onMouseEnter={() => opts.openCard(m.annId)}
        onClick={() => opts.openCard(m.annId)}
      >
        {m.anchor}
      </Highlight>
    );
    // always-on interlinear italic micro-note beside EVERY annotated term,
    // so the 150% layer reads like a fully marked-up page (the card adds depth).
    if (a.gloss) {
      nodes.push(
        <span
          key={`${m.annId}-gloss`}
          style={{
            fontFamily: "var(--font-sans)", fontStyle: "italic", fontSize: "0.6em",
            color: "var(--text-muted)",
            margin: "0 0.2em", verticalAlign: "baseline", whiteSpace: "normal",
          }}
        >
          — {a.gloss}
        </span>
      );
    }
    cursor = m.start + m.len;
  });
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n).trimEnd() + "…" : s;
}

function DepthLadder({ depth }: { depth: string }) {
  const steps = ["5%", "150%", "100%"];
  const labels: Record<string, string> = { "5%": "Simplified", "150%": "Assisted", "100%": "Original" };
  const idx = steps.indexOf(depth);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {steps.map((s, i) => {
        const active = s === depth;
        const passed = idx >= i;
        return (
          <React.Fragment key={s}>
            {i > 0 && <span style={{ width: 14, height: 2, background: passed ? "var(--accent)" : "var(--border-strong)" }} />}
            <span
              title={labels[s]}
              style={{
                fontFamily: "var(--font-sans)", fontSize: "var(--text-caption)",
                fontWeight: active ? "var(--weight-semibold)" : "var(--weight-regular)",
                color: active ? "var(--accent)" : passed ? "var(--text-muted)" : "var(--text-faint)",
                padding: "3px 9px", borderRadius: "var(--radius-full)",
                background: active ? "var(--accent-tint)" : "transparent",
              }}
            >
              {s}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function ZoomBtn({ label, icon, onClick, disabled, primary, active }: { label: string; icon: string; onClick: () => void; disabled?: boolean; primary?: boolean; active?: boolean }) {
  return (
    <button
      onClick={onClick} disabled={disabled} aria-label={label} title={label}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 34, height: 34, borderRadius: "var(--radius-md)",
        border: `1px solid ${primary ? "transparent" : active ? "var(--accent)" : "var(--border)"}`,
        background: primary ? "var(--accent)" : active ? "var(--accent-tint)" : "transparent",
        color: primary ? "var(--on-accent)" : active ? "var(--accent)" : "var(--text-muted)",
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1,
      }}
    >
      <Icon name={icon} size={18} />
    </button>
  );
}
