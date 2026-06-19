"use client";
import React from "react";
import { AnimatePresence } from "framer-motion";
import type { Paper, DomainId } from "@/lib/types";
import { Icon } from "./ds/Icons";
import { Badge } from "./ds/Badge";
import { SkeletonReader } from "./SkeletonReader";
import { MagazineReader } from "./MagazineReader";
import { ZoomLayer } from "./ZoomLayer";
import { OriginalMode } from "./OriginalMode";

type Layout = "column" | "magazine";

// Depth axis (deepening): 5% skeleton → "augmented" (150%) → "annotation-detail" → "original" (clean 100%)
export type ZoomLevel = "augmented" | "annotation-detail" | "original";

export function Reader({
  paper,
  unfamiliar,
  dark,
  onToggleDark,
  onEditBackground,
}: {
  paper: Paper;
  unfamiliar: Set<DomainId>;
  dark: boolean;
  onToggleDark: () => void;
  onEditBackground: () => void;
}) {
  const [fullOriginal, setFullOriginal] = React.useState(false);
  const [layout, setLayout] = React.useState<Layout>("column");
  const [zoomSegment, setZoomSegment] = React.useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = React.useState<ZoomLevel>("augmented");
  const [hovered, setHovered] = React.useState<string | null>(null);
  const [originRect, setOriginRect] = React.useState<DOMRect | null>(null);
  const [flashSegment, setFlashSegment] = React.useState<string | null>(null);
  const [focusedAnn, setFocusedAnn] = React.useState<string | null>(null);

  // refs mirror state for the global pinch listener
  const zoomRef = React.useRef<string | null>(null);
  const levelRef = React.useRef<ZoomLevel>("augmented");
  const hoveredRef = React.useRef<string | null>(null);
  const flashTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const focusedAnnRef = React.useRef<string | null>(null);
  zoomRef.current = zoomSegment;
  levelRef.current = zoomLevel;
  hoveredRef.current = hovered;
  focusedAnnRef.current = focusedAnn;

  const openSegment = (id: string, rect?: DOMRect) => {
    if (rect) setOriginRect(rect);
    setFlashSegment(null);
    setZoomSegment(id);
    setZoomLevel("augmented"); // zoom-in lands on the 150% assist layer first
  };
  const closeZoom = () => {
    const from = zoomRef.current;
    setZoomSegment(null);
    setFocusedAnn(null);
    if (from) {
      setFlashSegment(from);
      if (flashTimer.current) clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setFlashSegment(null), 1600);
    }
  };
  const zoomIn = () => {
    if (levelRef.current === "augmented") {
      // if an annotation card is open, dive into its detail view; else go to clean original
      if (focusedAnnRef.current) setZoomLevel("annotation-detail");
      else setZoomLevel("original");
    } else if (levelRef.current === "annotation-detail") {
      setZoomLevel("original");
    }
  };
  const zoomOut = () => {
    if (levelRef.current === "original") setZoomLevel("augmented");
    else if (levelRef.current === "annotation-detail") { setZoomLevel("augmented"); setFocusedAnn(null); }
    else closeZoom();
  };

  // keyboard
  React.useEffect(() => {
    if (!zoomSegment) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "-" || e.key === "_") zoomOut();
      if (e.key === "+" || e.key === "=") zoomIn();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomSegment]);

  // trackpad pinch-to-zoom (macOS pinch arrives as wheel + ctrlKey)
  const lastPinch = React.useRef(0);
  React.useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return; // only pinch gestures
      e.preventDefault();
      const now = Date.now();
      if (now - lastPinch.current < 320) return; // one step per gesture
      const deeper = e.deltaY < 0; // spread fingers → zoom in / deeper
      if (zoomRef.current) {
        deeper ? zoomIn() : zoomOut();
        lastPinch.current = now;
      } else if (deeper && hoveredRef.current && !fullOriginal) {
        openSegment(hoveredRef.current);
        lastPinch.current = now;
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [fullOriginal]);

  const iconBtn: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    width: 36, height: 36, borderRadius: "var(--radius-md)", border: "1px solid transparent",
    background: "transparent", color: "var(--text-muted)", cursor: "pointer",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 30, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <span style={{ color: "var(--accent)", display: "inline-flex" }}><Icon name="layers" size={20} /></span>
          <span style={{ fontSize: "var(--text-caption)", color: "var(--text-faint)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {paper.meta.venue} · {paper.meta.authors}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {!fullOriginal && (
            <div style={{ display: "inline-flex", padding: 3, gap: 2, background: "var(--surface-sunken)", borderRadius: "var(--radius-md)", marginRight: 4 }}>
              {([["column", "book", "Column"], ["magazine", "layers", "Magazine"]] as const).map(([key, icon, label]) => (
                <button
                  key={key}
                  onClick={() => setLayout(key)}
                  title={`${label} layout`}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px",
                    borderRadius: "var(--radius-sm)", border: "none", cursor: "pointer",
                    fontSize: "var(--text-caption)", fontWeight: "var(--weight-medium)",
                    background: layout === key ? "var(--surface)" : "transparent",
                    color: layout === key ? "var(--accent)" : "var(--text-muted)",
                    boxShadow: layout === key ? "var(--shadow-sm)" : "none",
                  }}
                >
                  <Icon name={icon} size={15} />{label}
                </button>
              ))}
            </div>
          )}
          <button style={iconBtn} onClick={onEditBackground} aria-label="Edit background" title="Edit your background"><Icon name="settings" size={19} /></button>
          <button style={iconBtn} onClick={onToggleDark} aria-label="Theme" title="Toggle theme"><Icon name={dark ? "sun" : "moon"} size={19} /></button>
          <button
            onClick={() => setFullOriginal((v) => !v)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 13px",
              borderRadius: "var(--radius-md)", cursor: "pointer", fontSize: "var(--text-caption)", fontWeight: "var(--weight-medium)",
              border: `1px solid ${fullOriginal ? "transparent" : "var(--border-strong)"}`,
              background: fullOriginal ? "var(--accent)" : "var(--surface)",
              color: fullOriginal ? "var(--on-accent)" : "var(--text)",
            }}
          >
            <Icon name="fileText" size={15} />
            {fullOriginal ? "Back to reading" : "Original mode"}
          </button>
        </div>
      </header>

      {!fullOriginal && layout === "column" && (
        <div style={{ padding: "28px 24px 16px", borderBottom: "1px solid var(--border)", maxWidth: 760, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            {paper.meta.badges.map((b, i) => <Badge key={b} tone={i === 0 ? "soft" : "default"}>{b}</Badge>)}
            <Badge tone="soft">Plain · Simplified</Badge>
          </div>
          <h1 className="serif" style={{ fontSize: "var(--text-h1)", fontWeight: 600, lineHeight: "var(--leading-snug)", margin: 0 }}>
            {paper.meta.title}
          </h1>
          <p style={{ fontSize: "var(--text-annotation)", color: "var(--text-muted)", margin: "10px 0 0", maxWidth: "60ch" }}>
            You're reading the plain-language skeleton. Click — or pinch — any sentence to zoom into the AI assist layer, then again for the clean original.
          </p>
        </div>
      )}

      {fullOriginal ? (
        <OriginalMode paper={paper} />
      ) : layout === "magazine" ? (
        <MagazineReader paper={paper} unfamiliar={unfamiliar} onOpenSegment={openSegment} onHoverSegment={setHovered} activeSegment={zoomSegment} flashSegment={flashSegment} />
      ) : (
        <SkeletonReader paper={paper} unfamiliar={unfamiliar} onOpenSegment={openSegment} onHoverSegment={setHovered} activeSegment={zoomSegment} flashSegment={flashSegment} />
      )}

      <AnimatePresence>
        {zoomSegment && (
          <ZoomLayer
            key="zoom"
            paper={paper}
            unfamiliar={unfamiliar}
            segmentId={zoomSegment}
            level={zoomLevel}
            originRect={originRect}
            focusedAnn={focusedAnn}
            onFocusAnn={setFocusedAnn}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onClose={closeZoom}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
