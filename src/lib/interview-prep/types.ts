export interface InterviewPrepItem {
  id: string;
  label: string;
  mentalModelHook: string;
  fundamentalsSlug?: string;
  fundamentalsLabel?: string;
  fundamentalsBlurb?: string;
  scenarioSlug?: string;
  scenarioLabel?: string;
  scenarioBlurb?: string;
}

export interface Phase {
  number: number;
  label: string;
  emoji: string;
  goal: string;
  items: InterviewPrepItem[];
}
