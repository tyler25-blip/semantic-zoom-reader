"use client";
import React from "react";
import { getPaper } from "@/lib/contentProvider";
import type { DomainId } from "@/lib/types";
import { UploadScreen } from "@/components/UploadScreen";
import { BackgroundSetup } from "@/components/BackgroundSetup";
import { Reader } from "@/components/Reader";

type Phase = "upload" | "background" | "reading";

export default function Page() {
  const paper = getPaper();
  const [phase, setPhase] = React.useState<Phase>("upload");
  const [unfamiliar, setUnfamiliar] = React.useState<Set<DomainId>>(new Set());
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {phase === "upload" && <UploadScreen paper={paper} onStart={() => setPhase("background")} />}
      {phase === "background" && (
        <BackgroundSetup
          paper={paper}
          selected={unfamiliar}
          onToggle={(id) =>
            setUnfamiliar((prev) => {
              const next = new Set(prev);
              next.has(id) ? next.delete(id) : next.add(id);
              return next;
            })
          }
          onContinue={() => setPhase("reading")}
          onBack={() => setPhase("upload")}
        />
      )}
      {phase === "reading" && (
        <Reader
          paper={paper}
          unfamiliar={unfamiliar}
          dark={dark}
          onToggleDark={() => setDark((d) => !d)}
          onEditBackground={() => setPhase("background")}
        />
      )}
    </main>
  );
}
