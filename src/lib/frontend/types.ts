export interface FrontendJourneyProblem {
  id: string;
  slug: string;
  label: string;
}

export interface ScenarioRef {
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
  practice: FrontendJourneyProblem[];
  advanced: FrontendJourneyProblem[];
  scenarios?: ScenarioRef[];
}

export interface Phase {
  number: number;
  label: string;
  emoji: string;
  goal: string;
  sections: FrontendJourneySection[];
}
