// Section outlines — the authored "architecture" behind a magazine section.
// Zooming a section heading opens this as a map of cards + arrows, showing how
// the section's points relate and which ORIGINAL chapter each came from. Each
// node points at skeleton segment(s); zooming a node drills into those (the
// original text, with the node's sentences marked).
//
// Wizard-of-Oz, authored per section. Section C is the first one.

export interface OutlineNode {
  id: string;
  title: string; // short headline, e.g. "It's too late"
  blurb: string; // one-line plain-language gist
  segments: string[]; // skeleton segment ids — segments[0] is the zoom target; all are marked
}

export interface SectionOutline {
  intro?: OutlineNode; // optional context / entry node
  introLabel?: string; // relationship from intro → the children
  children: OutlineNode[]; // the sibling points
  groupLabel?: string; // a note grouping the children
  edgeLabel?: string; // relationship from children → root
  root: OutlineNode; // the point everything adds up to (top of the map)
}

export const OUTLINES: Record<string, SectionOutline> = {
  A: {
    intro: {
      id: "a-setup",
      title: "The setup",
      blurb:
        "An AI quietly watches every patient for one of medicine’s deadliest emergencies — and doctors have learned to tune it out. This study asks why.",
      segments: ["s1", "s2", "s3"],
    },
    introLabel: "two facts behind it",
    children: [
      {
        id: "a-disease",
        title: "The disease",
        blurb: "Sepsis can turn a stable patient into a dying one within hours.",
        segments: ["s4"],
      },
      {
        id: "a-alarm",
        title: "The distrusted alarm",
        blurb: "Most hospitals already own a warning system — and these six clinicians had stopped believing it.",
        segments: ["s5"],
      },
    ],
    groupLabel: "the problem in brief",
    edgeLabel: "which points to one diagnosis",
    root: {
      id: "a-core",
      title: "Aimed at the wrong moment",
      blurb:
        "The AI handed down a final verdict when doctors needed a partner for the uncertain middle — so the team rebuilt it as SepsisLab.",
      segments: ["s6", "s7", "s8"],
    },
  },

  B: {
    children: [
      {
        id: "b-odds",
        title: "Merciless odds",
        blurb: "~48.9M cases a year, ~11M deaths — catching it early is everything.",
        segments: ["s9", "s10"],
      },
      {
        id: "b-forces",
        title: "Three forces at once",
        blurb: "Life-or-death stakes, a sprinting clock, and a decision due before the evidence arrives.",
        segments: ["s11"],
      },
      {
        id: "b-two",
        title: "Two questions, not one",
        blurb: "Does this patient have sepsis now — and are they about to?",
        segments: ["s12"],
      },
      {
        id: "b-slow",
        title: "The deciding test is too slow",
        blurb: "A blood culture takes 8+ hours; a patient can crash in less.",
        segments: ["s13"],
      },
    ],
    groupLabel: "what makes the call so hard",
    edgeLabel: "so, instead of waiting",
    root: {
      id: "b-steps",
      title: "Four quick steps",
      blurb: "Doctors form a hunch, gather data, test it against fresh labs, then commit.",
      segments: ["s14"],
    },
  },

  RW: {
    intro: {
      id: "rw-look",
      title: "A look at prior work",
      blurb: "Before building anything, the team reviewed what’s known about putting AI in the clinic.",
      segments: ["sr1"],
    },
    introLabel: "the familiar pattern",
    children: [
      {
        id: "rw-wary",
        title: "Helpful but distrusted",
        blurb: "Doctors stay wary: they carry the legal responsibility, the models are opaque, and AI can even add work.",
        segments: ["sr2"],
      },
    ],
    edgeLabel: "which, for sepsis, points to",
    root: {
      id: "rw-trust",
      title: "The fix is trust, not flash",
      blurb: "Not fancier explanations — explanations that match how a doctor already thinks.",
      segments: ["sr3"],
    },
  },

  C: {
    intro: {
      id: "c-setup",
      title: "The tool on trial",
      blurb:
        "Hospitals run the Epic Sepsis Module — it boils a chart down to one risk score and alarms. To learn why staff tune it out, the team interviewed six clinicians who live with it.",
      segments: ["s15", "s16", "s17", "sm1"],
    },
    introLabel: "we asked six clinicians why they ignore it",
    children: [
      {
        id: "c-late",
        title: "It’s too late",
        blurb: "The alert usually fires after the doctor has already spotted the sepsis.",
        segments: ["s19"],
      },
      {
        id: "c-noisy",
        title: "It cries wolf",
        blurb: "Tuned to miss nothing, it’s wrong ~87% of the time — alert fatigue sets in.",
        segments: ["s20"],
      },
      {
        id: "c-blackbox",
        title: "It won’t explain itself",
        blurb: "A black box that can rate an obvious case below a subtle one.",
        segments: ["s21"],
      },
      {
        id: "c-useless",
        title: "It won’t say what to do",
        blurb: "A bare number with no next step — so most clinicians simply ignore it.",
        segments: ["s22"],
      },
      {
        id: "c-competitor",
        title: "It competes for the call",
        blurb: "By making the diagnosis itself, it acts as a rival, not a teammate.",
        segments: ["s23"],
      },
    ],
    groupLabel: "all five raised about the same tool",
    edgeLabel: "five complaints add up to this",
    root: {
      id: "c-core",
      title: "The real problem: wrong focus",
      blurb:
        "The AI aimed at the final verdict. Doctors wanted help in the messy middle of the decision, not an answer at the end.",
      segments: ["ssum"],
    },
  },

  D: {
    children: [
      {
        id: "d-job",
        title: "A different job, not a smarter verdict",
        blurb: "The cure isn’t a better final answer; it’s a different role.",
        segments: ["s24"],
      },
      {
        id: "d-middle",
        title: "Into the middle steps",
        blurb: "Move the AI out of the final-answer seat and into hunch-forming and data-gathering.",
        segments: ["s25"],
      },
    ],
    groupLabel: "one shift in role",
    edgeLabel: "which produced",
    root: {
      id: "d-rules",
      title: "Five design rules",
      blurb:
        "Forecast the risk, explain plainly, hand over next actions, show its uncertainty, and support the middle instead of seizing the end.",
      segments: ["s26"],
    },
  },

  E: {
    children: [
      {
        id: "e-traj",
        title: "A risk trajectory",
        blurb: "A line showing where risk is heading over the next four hours, continuing past “now”.",
        segments: ["s28"],
      },
      {
        id: "e-doubt",
        title: "Honest doubt",
        blurb: "A grey band widens wherever the model is unsure — confidence shown as honest uncertainty.",
        segments: ["s29"],
      },
      {
        id: "e-labrec",
        title: "Which test to run next",
        blurb: "Lab tests ranked by how much each would shrink the uncertainty.",
        segments: ["s30"],
      },
      {
        id: "e-whatif",
        title: "Play what-if",
        blurb: "Preview how a test would move the prediction — a counterfactual — before paying for it.",
        segments: ["s31"],
      },
    ],
    groupLabel: "all on the existing screen",
    edgeLabel: "three additions, plus a what-if",
    root: {
      id: "e-build",
      title: "SepsisLab, in the records screen",
      blurb: "The design rules, built into the existing chart — adding three things the old score never had.",
      segments: ["s27"],
    },
  },

  F: {
    children: [
      {
        id: "f-lstm",
        title: "An LSTM over time",
        blurb: "A neural net for sequences — a natural fit for a patient record that trickles in at odd hours.",
        segments: ["s32"],
      },
      {
        id: "f-attn",
        title: "Attention = coping + explanation",
        blurb: "Handles missing data, and what it attends to becomes the feature-importance list shown to doctors.",
        segments: ["s33"],
      },
      {
        id: "f-mc",
        title: "Monte-Carlo uncertainty",
        blurb: "It imagines the missing lab values many times and measures how much the answer jumps.",
        segments: ["s34"],
      },
      {
        id: "f-entropy",
        title: "Entropy triggers a recommendation",
        blurb: "When the wobble (Shannon entropy) climbs too high, it names the one test that would settle it.",
        segments: ["s35"],
      },
      {
        id: "f-cf",
        title: "Counterfactual what-if",
        blurb: "Re-runs the forecast as if the test had been done, so its payoff is weighed before paying its cost.",
        segments: ["scf"],
      },
    ],
    groupLabel: "the engine, part by part",
    edgeLabel: "and it holds up:",
    root: {
      id: "f-result",
      title: "The payoff",
      blurb:
        "On real ICU records it nearly matched a model that saw everything — asking ~9.6% more tests, and beating the data-starved baseline by ~10%.",
      segments: ["s36"],
    },
  },

  G: {
    intro: {
      id: "g-test",
      title: "The test",
      blurb:
        "The same six clinicians worked through ten de-identified MIMIC-III cases (five septic, five not), the prototype standing in as a design probe.",
      segments: ["s37", "sem"],
    },
    introLabel: "and the reactions, point by point",
    children: [
      {
        id: "g-traj",
        title: "“It says the whole picture”",
        blurb: "All six liked seeing risk as a trajectory — not just now, but where things head next.",
        segments: ["sef1"],
      },
      {
        id: "g-actionable",
        title: "Suggestions they’d act on",
        blurb: "The lab-test recommendations fit the workflow; doctors said they’d order what the model asked.",
        segments: ["sef2"],
      },
      {
        id: "g-trust",
        title: "What-if builds trust",
        blurb: "Seeing how a test would move the prediction let them reason instead of leaning on gut alone.",
        segments: ["sef3"],
      },
      {
        id: "g-worry",
        title: "One worry: dosage",
        blurb: "Don’t drown us — hand the information over a step at a time.",
        segments: ["s40"],
      },
    ],
    groupLabel: "what the six clinicians said",
    edgeLabel: "which all added up to",
    root: {
      id: "g-collab",
      title: "It felt like a collaborator",
      blurb: "Pulling the AI out of the verdict seat made it feel less like a rival and more like a teammate.",
      segments: ["s38"],
    },
  },

  H: {
    children: [
      {
        id: "h-where",
        title: "Where AI sits",
        blurb: "Chasing the most accurate final score is what broke collaboration; the win came from helping the steps before the verdict.",
        segments: ["sdis"],
      },
      {
        id: "h-beyond",
        title: "Beyond sepsis",
        blurb: "Wherever a call is high-stakes, uncertain and racing a clock — stroke, heart attacks, mental-health crises, even disaster response.",
        segments: ["s41", "s42"],
      },
      {
        id: "h-risks",
        title: "The risks",
        blurb: "It can add cognitive load, can still be wrong in unsolved ways, and lean on it too hard and your vigilance dulls.",
        segments: ["s43"],
      },
      {
        id: "h-early",
        title: "Early evidence",
        blurb: "One hospital, six clinicians, a prototype never wired into the live records system.",
        segments: ["s44"],
      },
    ],
    groupLabel: "zooming out from sepsis",
    edgeLabel: "all leading to one bottom line",
    root: {
      id: "h-bottom",
      title: "The bottom line",
      blurb:
        "In fast, high-stakes, uncertain calls, AI helps most as a partner in the middle of the work — and SepsisLab is one way to build that.",
      segments: ["scon"],
    },
  },
};
