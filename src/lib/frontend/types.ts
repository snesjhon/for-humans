export interface FrontendJourneySection {
  id: string;
  label: string;
  mentalModelHook: string;
  fundamentalsSlug: string;
  fundamentalsBlurb: string;
}

export interface Phase {
  number: number;
  label: string;
  emoji: string;
  goal: string;
  sections: FrontendJourneySection[];
}
