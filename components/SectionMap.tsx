"use client";
import React from "react";
import { motion } from "framer-motion";
import type { Paper, Section } from "@/lib/types";
import type { OutlineNode, SectionOutline } from "@/lib/outline";
import { Icon } from "./ds/Icons";

/**
 * SectionMap — the "architecture" of a magazine section, shown when you zoom its
 * heading. Cards + arrows lay out how the section's points relate (e.g. five
 * complaints → one core problem) and which ORIGINAL chapter each came from.
 * Clicking a card zooms into that point's original text.
 */

const silk = [0.22, 1, 0.36, 1] as const;

function chaptersFor(node: OutlineNode, paper: Paper): string[] {
  const pids: string[] = [];
  node.segments.forEach((sid) => {
    const seg = paper.skeleton.find((s) => s.id === sid);
    seg?.source.forEach((p) => { if (!pids.includes(p)) pids.push(p); });
  });
  const labels: string[] = [];
  pids.forEach((pid) => {
    const lab = paper.original.find((p) => p.id === pid)?.label;
    if (lab && !labels.includes(lab)) labels.push(lab);
  });
  return labels;
}

const shortChapter = (label: string) => (label.match(/^§[\d.]+/)?.[0] ?? label);

export function SectionMap({
  paper,
  outline,
  section,
  onZoomNode,
  onHoverNode,
  onClose,
  paused = false,
}: {
  paper: Paper;
  outline: SectionOutline;
  section: Section;
  onZoomNode: (node: OutlineNode) => void;
  onHoverNode?: (node: OutlineNode | null) => void;
  onClose: () => void;
  paused?: boolean; // a node's original view is on top — let it own the keys
}) {
  React.useEffect(() => {
    if (paused) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "-" || e.key === "_") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, paused]);

  return (
    <motion.div
      initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1 }}
      transition={{ duration: 0.34 }}
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", flexDirection: "column" }}
    >
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: silk }}
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(20,22,26,0.45)", backdropFilter: "blur(1.5px)" }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.36, ease: silk }}
        style={{
          position: "relative", margin: "auto", marginTop: "4vh", marginBottom: "4vh",
          width: "min(720px, 94vw)", maxHeight: "92vh", display: "flex", flexDirection: "column",
          background: "var(--surface)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--border)", overflow: "hidden",
        }}
      >
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <div style={{ minWidth: 0 }}>
            <div className="eyebrow" style={{ color: "var(--accent)" }}>Structure · {section.eyebrow}</div>
            <div className="serif" style={{ fontSize: "var(--text-h3)", fontWeight: 600, color: "var(--text)", lineHeight: 1.2, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {section.heading}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <span style={{ fontSize: "var(--text-caption)", color: "var(--text-faint)", marginRight: 4, whiteSpace: "nowrap" }}>click a card to open the original</span>
            <button onClick={onClose} aria-label="Close" title="Close (Esc)" style={iconBtn}><Icon name="x" size={18} /></button>
          </div>
        </div>

        {/* map body */}
        <div style={{ overflow: "auto", padding: "26px 26px 32px" }}>
          {/* root — what it all adds up to */}
          <NodeCard node={outline.root} paper={paper} variant="root" onClick={() => onZoomNode(outline.root)} onHover={(h) => onHoverNode?.(h ? outline.root : null)} />

          {outline.edgeLabel && <Connector label={outline.edgeLabel} />}

          {/* children — the sibling points */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {outline.children.map((n) => (
              <NodeCard key={n.id} node={n} paper={paper} variant="child" onClick={() => onZoomNode(n)} onHover={(h) => onHoverNode?.(h ? n : null)} />
            ))}
          </div>

          {outline.groupLabel && <GroupTag label={outline.groupLabel} />}

          {/* intro — the context everything started from */}
          {outline.intro && (
            <>
              {outline.introLabel && <Connector label={outline.introLabel} muted />}
              <NodeCard node={outline.intro} paper={paper} variant="intro" onClick={() => onZoomNode(outline.intro!)} onHover={(h) => onHoverNode?.(h ? outline.intro! : null)} />
            </>
          )}
        </div>

        {/* footer */}
        <div style={{ flexShrink: 0, borderTop: "1px solid var(--border)", padding: "9px 18px", fontSize: "var(--text-caption)", color: "var(--text-faint)", display: "flex", justifyContent: "space-between", gap: 12 }}>
          <span>How this section is built — and where each part comes from in the paper.</span>
          <span style={{ whiteSpace: "nowrap" }}>Esc to close</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

const iconBtn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  width: 34, height: 34, borderRadius: "var(--radius-md)", border: "1px solid var(--border)",
  background: "transparent", color: "var(--text-muted)", cursor: "pointer",
};

function NodeCard({
  node, paper, variant, onClick, onHover,
}: {
  node: OutlineNode;
  paper: Paper;
  variant: "root" | "child" | "intro";
  onClick: () => void;
  onHover?: (hovering: boolean) => void;
}) {
  const [hover, setHover] = React.useState(false);
  const chapters = chaptersFor(node, paper);
  const isRoot = variant === "root";
  const isIntro = variant === "intro";

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => { setHover(true); onHover?.(true); }}
      onMouseLeave={() => { setHover(false); onHover?.(false); }}
      style={{
        display: "block", width: "100%", textAlign: "left", cursor: "pointer",
        padding: isRoot ? "16px 18px" : "13px 16px",
        borderRadius: "var(--radius-lg)",
        border: `1px solid ${isRoot ? "var(--accent)" : hover ? "var(--accent-soft)" : "var(--border-strong)"}`,
        background: isRoot ? "var(--accent-tint)" : hover ? "var(--surface-sunken)" : "var(--surface)",
        boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
        transition: "border-color 140ms ease, background 140ms ease, box-shadow 140ms ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          {isRoot && <span style={{ color: "var(--accent)", display: "inline-flex", alignSelf: "center" }}><Icon name="sparkles" size={16} /></span>}
          <span className="serif" style={{ fontSize: isRoot ? "var(--text-h3)" : "var(--text-body)", fontWeight: 600, color: "var(--text)", lineHeight: 1.25 }}>
            {node.title}
          </span>
        </span>
        <span style={{ display: "flex", gap: 4, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {chapters.map((c) => (
            <span key={c} title={c} style={{
              fontFamily: "var(--font-sans)", fontSize: "var(--text-caption)", fontWeight: "var(--weight-medium)",
              color: "var(--accent)", background: "var(--accent-tint)", border: "1px solid var(--accent-line)",
              padding: "1px 7px", borderRadius: "var(--radius-full)", whiteSpace: "nowrap",
            }}>
              {shortChapter(c)}
            </span>
          ))}
        </span>
      </div>
      <p style={{
        margin: "5px 0 0", fontFamily: "var(--font-sans)",
        fontSize: isIntro ? "var(--text-caption)" : "var(--text-annotation)",
        lineHeight: "var(--leading-normal)", color: "var(--text-muted)",
      }}>
        {node.blurb}
      </p>
    </button>
  );
}

/** A vertical connector: a line, an up-arrow, and a relationship label. */
function Connector({ label, muted }: { label: string; muted?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, padding: "2px 0" }}>
      <span style={{ width: 2, height: 14, background: muted ? "var(--border-strong)" : "var(--accent-line)" }} />
      <span style={{ color: muted ? "var(--text-faint)" : "var(--accent)", fontSize: 11, lineHeight: 1, marginBottom: 2 }}>▲</span>
      <span style={{
        fontFamily: "var(--font-sans)", fontSize: "var(--text-caption)", fontWeight: "var(--weight-medium)",
        color: muted ? "var(--text-faint)" : "var(--accent)",
        background: muted ? "var(--surface-sunken)" : "var(--accent-tint)",
        border: `1px solid ${muted ? "var(--border)" : "var(--accent-line)"}`,
        padding: "3px 11px", borderRadius: "var(--radius-full)",
      }}>
        {label}
      </span>
      <span style={{ width: 2, height: 14, background: muted ? "var(--border-strong)" : "var(--accent-line)", marginTop: 2 }} />
    </div>
  );
}

/** A small grouping note under the sibling cards. */
function GroupTag({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
      <span style={{
        fontFamily: "var(--font-sans)", fontSize: "var(--text-caption)", color: "var(--text-faint)",
        border: "1px dashed var(--border-strong)", padding: "3px 12px", borderRadius: "var(--radius-full)",
      }}>
        {label}
      </span>
    </div>
  );
}
