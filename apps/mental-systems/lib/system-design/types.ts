export interface JourneyScenario {
  slug: string                        // "design-url-shortener"
  label: string                       // "Design a URL Shortener"
  relatedFundamentalsSlugs: string[]  // ["caching-fundamentals", "scalability-fundamentals"]
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
