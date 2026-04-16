export interface JourneyScenario {
  slug: string
  label: string
  relatedFundamentalsSlugs: string[]
}

export interface JourneySection {
  id: string
  label: string
  mentalModelHook: string
  analogies: string[]
  fundamentalsSlug?: string
  fundamentalsBlurb?: string
  firstPass: JourneyScenario[]
  reinforce: JourneyScenario[]
}

export interface Phase {
  number: number
  label: string
  emoji: string
  goal: string
  sections: JourneySection[]
}
