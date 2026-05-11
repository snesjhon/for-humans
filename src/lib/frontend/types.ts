export interface FrontendJourneyProblem {
  id: string;
  slug: string;
  label: string;
}

export interface BuildingRef {
  slug: string;
  label: string;
  blurb: string;
}

export interface ConceptRef {
  slug: string;
  label: string;
  blurb: string;
}

export interface FrontendJourneySection {
  id: string;
  label: string;
  mentalModelHook: string;
  fundamentalsSlug: string;
  fundamentalsBlurb: string;
  additionalFundamentals?: { slug: string; blurb: string }[];
  practice: FrontendJourneyProblem[];
  explorations: FrontendJourneyProblem[];
  builds?: BuildingRef[];
  concepts?: ConceptRef[];
}

export interface Phase {
  number: number;
  label: string;
  emoji: string;
  goal: string;
  sections: FrontendJourneySection[];
}
