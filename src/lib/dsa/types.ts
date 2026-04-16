export interface Problem {
  id: string           // "001", "022", "200"
  title: string        // "Two Sum"
  hasMentalModel: boolean
  slug: string         // "022-generate-parentheses"
  files: {
    mentalModel?: string
  }
}
