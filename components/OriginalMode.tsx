"use client";
import React from "react";
import type { Paper } from "@/lib/types";
import { Button } from "./ds/Button";
import { Icon } from "./ds/Icons";

/**
 * 100% — the verbatim original. We embed the actual source PDF so nothing is
 * lost: every figure, chart and table appears exactly as published.
 */
const pdfPath = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/paper.pdf`;

export function OriginalMode({ paper }: { paper: Paper }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 24px", borderBottom: "1px solid var(--border)", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <span className="eyebrow" style={{ color: "var(--text-muted)" }}>Original · 100% · full PDF</span>
          <span className="serif" style={{ fontSize: "var(--text-annotation)", color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "52ch" }}>
            {paper.meta.title}
          </span>
        </div>
        <a href={pdfPath} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <Button variant="secondary" size="sm" icon={<Icon name="fileText" size={15} />}>Open PDF in new tab</Button>
        </a>
      </div>

      {/* the real paper, verbatim — figures, charts, tables included */}
      <object data={`${pdfPath}#view=FitH`} type="application/pdf" style={{ flex: 1, width: "100%", minHeight: "78vh", border: "none", background: "var(--surface-sunken)" }}>
        <iframe src={pdfPath} title="Original paper (PDF)" style={{ flex: 1, width: "100%", height: "82vh", border: "none" }} />
        <div style={{ padding: "var(--space-8)", textAlign: "center", color: "var(--text-muted)" }}>
          Your browser can't show the PDF inline.{" "}
          <a href={pdfPath} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>Open it in a new tab.</a>
        </div>
      </object>
    </div>
  );
}
