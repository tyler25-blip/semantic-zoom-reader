// Shared content types. The data shape is the seam: today it comes from
// data/paper.json (Wizard-of-Oz); later contentProvider can return the same
// shape from a live API without the UI changing.

export type DomainId = "clinical" | "ml" | "hci" | "stats";

export type DifficultyTag =
  | "vocab"
  | "concept-density"
  | "background"
  | "numbers"
  | "argument-role"
  | DomainId;

export interface Domain {
  id: DomainId;
  name: string;
  blurb: string;
}

export interface Section {
  id: string;
  eyebrow: string;
  heading: string;
}

export interface Segment {
  id: string;
  section: string;
  break?: boolean; // starts a new paragraph in the 5% article
  text: string;
  source: string[]; // original paragraph ids this segment zooms into
  tags: DifficultyTag[];
}

export interface OriginalParagraph {
  id: string;
  label: string;
  text: string;
}

export type AnnotationCategory =
  | "vocab"
  | "concept-density"
  | "background"
  | "numbers"
  | "argument-role";

export type AnnotationDisplay = "inline" | "panel";

export interface NumberViz {
  type: "dots" | "fraction";
  total: number;
  filled: number;
  label: string;
}

export interface Annotation {
  id: string;
  anchor: string; // span of the ORIGINAL text this note attaches to
  domain: DomainId;
  category: AnnotationCategory;
  display: AnnotationDisplay; // "inline" pins only if its domain is unfamiliar
  content: string; // the plain-language gist
  gloss?: string; // short interlinear italic note (always-on for unfamiliar domains)
  example?: string; // optional concrete "E.g. … → takeaway"
  viz?: NumberViz;
}

export interface Augment {
  annotations: Annotation[];
}

export interface Paper {
  meta: { title: string; authors: string; venue: string; badges: string[] };
  domains: Domain[];
  sections: Section[];
  skeleton: Segment[];
  original: OriginalParagraph[];
  augment: Record<string, Augment>;
}
