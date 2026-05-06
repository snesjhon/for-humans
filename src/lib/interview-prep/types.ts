export interface InterviewPrepLesson {
  id: string;
  slug: string;
  label: string;
  mentalModelHook: string;
  blurb: string;
  conceptFocus: string[];
}

export interface Phase {
  number: number;
  label: string;
  emoji: string;
  goal: string;
  lessons: InterviewPrepLesson[];
}
