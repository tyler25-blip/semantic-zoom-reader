// Figures extracted verbatim from the source PDF (public/figures/*.png).
// `after` places the plate right after that section in the magazine layout.

export interface Figure {
  src: string;
  label: string;
  caption: string;
  after: string; // section id to place this figure after
  portrait?: boolean; // tall figure — allow a little more height
}

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const FIGURES: Figure[] = [
  {
    src: `${base}/figures/fig1.png`,
    label: "Figure 1",
    caption: "The existing Epic Sepsis Module sits at the final decision (right), forming a human-AI “competition”. The proposed module instead supports the earlier steps — generating hypotheses, gathering data, testing hypotheses.",
    after: "A",
  },
  {
    src: `${base}/figures/fig2.png`,
    label: "Figure 2",
    caption: "The current human-AI “competition” paradigm: the sepsis module mainly supports the final decision-making stage, yet physicians find the predictions too late and not helpful.",
    after: "C",
  },
  {
    src: `${base}/figures/fig3.png`,
    label: "Figure 3",
    caption: "SepsisLab supports the intermediate steps of the clinician's workflow — predicting future risk, ranking the most useful lab tests, and updating as new data arrives.",
    after: "D",
  },
  {
    src: `${base}/figures/fig4.png`,
    label: "Figure 4",
    caption: "SepsisLab's interface: (A) a patient list coloured by risk, (B) the patient's vitals and labs, (C) the lab-test recommendation add-on with the future risk trajectory and its uncertainty.",
    after: "E",
  },
  {
    src: `${base}/figures/fig5a.png`,
    label: "Figure 5",
    caption: "The interactive lab-test recommendation: items are ranked by how much they would reduce the prediction's uncertainty; selecting one previews its counterfactual effect on the risk trajectory.",
    after: "E",
    portrait: true,
  },
];
