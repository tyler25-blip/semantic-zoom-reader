import React from "react";

export function Badge({
  children,
  tone = "default",
  style = {},
}: {
  children: React.ReactNode;
  tone?: "default" | "soft";
  style?: React.CSSProperties;
}) {
  const soft = tone === "soft";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-caption)",
        fontWeight: "var(--weight-medium)",
        padding: "3px 10px",
        borderRadius: "var(--radius-full)",
        background: soft ? "var(--accent-tint)" : "var(--surface)",
        color: soft ? "var(--accent)" : "var(--text-muted)",
        border: `1px solid ${soft ? "transparent" : "var(--border)"}`,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
