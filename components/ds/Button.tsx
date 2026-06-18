"use client";
import React from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  onClick,
  disabled,
  style = {},
  type = "button",
}: {
  children?: React.ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  type?: "button" | "submit";
}) {
  const [hover, setHover] = React.useState(false);
  const pad = size === "sm" ? "7px 12px" : "10px 16px";
  const font = size === "sm" ? "var(--text-caption)" : "var(--text-body)";

  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: pad,
    borderRadius: "var(--radius-md)",
    fontFamily: "var(--font-sans)",
    fontSize: font,
    fontWeight: "var(--weight-medium)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: "background 150ms ease, color 150ms ease, border-color 150ms ease",
    border: "1px solid transparent",
  };

  const variants: Record<Variant, React.CSSProperties> = {
    primary: {
      background: hover ? "var(--accent-hover)" : "var(--accent)",
      color: "var(--on-accent)",
    },
    secondary: {
      background: hover ? "var(--surface-sunken)" : "var(--surface)",
      color: "var(--text)",
      borderColor: "var(--border-strong)",
    },
    ghost: {
      background: hover ? "var(--accent-tint)" : "transparent",
      color: "var(--text-muted)",
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...variants[variant], ...style }}
    >
      {icon}
      {children}
    </button>
  );
}
