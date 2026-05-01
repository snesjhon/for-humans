export interface FrontendJourneyProblem {
  id: string;
  slug: string;
  label: string;
}

export interface FrontendJourneySection {
  id: string;
  label: string;
  mentalModelHook: string;
  fundamentalsSlug: string;
  fundamentalsBlurb: string;
  practice: FrontendJourneyProblem[];
  advanced: FrontendJourneyProblem[];
}

export interface Phase {
  number: number;
  label: string;
  emoji: string;
  goal: string;
  sections: FrontendJourneySection[];
}
