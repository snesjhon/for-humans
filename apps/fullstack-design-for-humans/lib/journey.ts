import type { Phase, JourneySection } from './types'

export type { JourneyScenario, JourneySection, Phase } from './types'

export const JOURNEY: Phase[] = [
  {
    number: 1,
    label: 'Novice',
    emoji: '🌱',
    goal: 'Build a working Rails API from scratch. Focus on the conventions, not the configuration.',
    sections: [
      {
        id: 'project-anatomy',
        label: 'Project Anatomy',
        mentalModelHook: "A Rails app is a set of conventions baked into folders. Understanding the folders is understanding the framework.",
        analogies: ["Rails folder structure as a restaurant kitchen layout — everything has a designated place so the chef doesn't have to think about it"],
        fundamentalsSlug: 'rails-new',
        fundamentalsBlurb: 'What rails new actually generates and why each file exists',
        firstPass: [
          { slug: 'setup-rails-api', label: 'Set Up the Rails API', relatedFundamentalsSlugs: ['rails-new'] },
        ],
        reinforce: [],
      },
      {
        id: 'database-fundamentals',
        label: 'Database Fundamentals',
        mentalModelHook: 'The database is the source of truth. Everything else is a cache or a view of it.',
        analogies: ['PostgreSQL vs SQLite as a bank vault vs a shoebox — both hold money, but only one is built for concurrent access'],
        fundamentalsSlug: 'postgresql-and-activerecord',
        fundamentalsBlurb: 'How PostgreSQL and ActiveRecord work together to store and retrieve data',
        firstPass: [
          { slug: 'configure-the-database', label: 'Configure the Database', relatedFundamentalsSlugs: ['postgresql-and-activerecord'] },
        ],
        reinforce: [],
      },
      {
        id: 'entities-and-relationships',
        label: 'Entities and Relationships',
        mentalModelHook: 'Every model is a noun. Every association is a verb. Name them that way.',
        analogies: ['Schema as a city map — streets (foreign keys) connect buildings (tables), but the buildings existed before the streets'],
        fundamentalsSlug: 'active-record-models',
        fundamentalsBlurb: 'How to model real-world objects as Rails models with associations and validations',
        firstPass: [
          { slug: 'model-players', label: 'Build the Player Model', relatedFundamentalsSlugs: ['active-record-models', 'postgresql-and-activerecord'] },
          { slug: 'model-games', label: 'Build the Game Model', relatedFundamentalsSlugs: ['active-record-models', 'postgresql-and-activerecord'] },
          { slug: 'model-analyses', label: 'Build the Analysis Model', relatedFundamentalsSlugs: ['active-record-models', 'postgresql-and-activerecord'] },
        ],
        reinforce: [],
      },
      {
        id: 'rest-api-basics',
        label: 'REST API Basics',
        mentalModelHook: 'A REST API is a collection of resources. Each resource is a noun. HTTP verbs are the only actions.',
        analogies: ['API routes as a filing cabinet — the cabinet name is the resource, the HTTP verb is what you do to the drawer'],
        fundamentalsSlug: 'rails-routing-and-controllers',
        fundamentalsBlurb: 'How Rails routes HTTP requests to controller actions and renders JSON responses',
        firstPass: [
          { slug: 'players-api', label: 'Build the Players API', relatedFundamentalsSlugs: ['rails-routing-and-controllers'] },
          { slug: 'games-api', label: 'Build the Games API', relatedFundamentalsSlugs: ['rails-routing-and-controllers'] },
          { slug: 'analyses-api', label: 'Build the Analyses API', relatedFundamentalsSlugs: ['rails-routing-and-controllers'] },
        ],
        reinforce: [],
      },
    ],
  },
  {
    number: 2,
    label: 'Studied',
    emoji: '📚',
    goal: 'Add production-grade behavior: async jobs, external integrations, and structured AI output.',
    sections: [
      {
        id: 'migrations-and-indexes',
        label: 'Migrations and Indexes',
        mentalModelHook: "A migration is a permanent record of a decision. An index is a bet that you'll look up this column often.",
        analogies: [
          'Migration as a legal amendment — you add to the document, you never cross out what came before',
          "Index as a book's index at the back — you look up the word, find the page. Every new entry costs ink.",
        ],
        fundamentalsSlug: 'rails-migrations',
        fundamentalsBlurb: 'How migrations track schema changes safely and when to add indexes',
        firstPass: [],
        reinforce: [],
      },
      {
        id: 'background-jobs',
        label: 'Background Jobs',
        mentalModelHook: 'A background job is a note you leave for yourself. The request handler drops the note and walks away.',
        analogies: ['Background job as a postal service — you hand off the package, the post office handles delivery and retries'],
        fundamentalsSlug: 'active-job-and-sidekiq',
        fundamentalsBlurb: 'How Sidekiq and Redis enable processing work outside the request/response cycle',
        firstPass: [
          { slug: 'sync-games-job', label: 'Build the Sync Games Job', relatedFundamentalsSlugs: ['active-job-and-sidekiq'] },
          { slug: 'analyze-game-job', label: 'Build the Analyze Game Job', relatedFundamentalsSlugs: ['active-job-and-sidekiq', 'the-claude-api'] },
        ],
        reinforce: [],
      },
      {
        id: 'external-http-clients',
        label: 'External HTTP Clients',
        mentalModelHook: "An external API is a dependency you can't deploy. Design your code to tolerate it being slow, down, or wrong.",
        analogies: ['Service object wrapping an API as a translator hired for one job — you tell the translator what you need, they handle the foreign language'],
        fundamentalsSlug: 'http-clients-in-rails',
        fundamentalsBlurb: 'How to wrap third-party APIs in service objects that handle errors and timeouts gracefully',
        firstPass: [
          { slug: 'chess-com-client', label: 'Build the chess.com API Client', relatedFundamentalsSlugs: ['http-clients-in-rails'] },
        ],
        reinforce: [],
      },
      {
        id: 'the-claude-api',
        label: 'The Claude API',
        mentalModelHook: "The API doesn't remember you. Every call is stateless. You pass the full context every time.",
        analogies: ['Claude API call as a conversation with someone who has amnesia — brilliant, but you must re-introduce yourself every time'],
        fundamentalsSlug: 'the-claude-api',
        fundamentalsBlurb: 'How the Claude API works: stateless calls, prompt design, and structured JSON output',
        firstPass: [
          { slug: 'per-game-analysis', label: 'Build Per-Game Analysis', relatedFundamentalsSlugs: ['the-claude-api'] },
          { slug: 'aggregate-analysis', label: 'Build Aggregate Style Analysis', relatedFundamentalsSlugs: ['the-claude-api'] },
          { slug: 'chess-chat', label: 'Build the Chess Chat Interface', relatedFundamentalsSlugs: ['the-claude-api'] },
        ],
        reinforce: [],
      },
    ],
  },
  {
    number: 3,
    label: 'Expert',
    emoji: '🎯',
    goal: 'Connect the backend to a real frontend, ship it to production, and understand what changes at scale.',
    sections: [
      {
        id: 'cors-and-api-boundary',
        label: 'CORS and the API Boundary',
        mentalModelHook: 'CORS is a bouncer. The browser checks the guest list (allowed origins) before the request gets in.',
        analogies: ['CORS as a bouncer at a club — your origin is checked at the door, not inside the venue'],
        fundamentalsSlug: 'cors-and-rack',
        fundamentalsBlurb: 'Why browsers enforce CORS and how to configure it correctly in a Rails API',
        firstPass: [
          { slug: 'dashboard', label: 'Build the React Dashboard', relatedFundamentalsSlugs: ['cors-and-rack'] },
          { slug: 'game-detail', label: 'Build the Game Detail View', relatedFundamentalsSlugs: ['cors-and-rack'] },
        ],
        reinforce: [],
      },
      {
        id: 'frontend-integration',
        label: 'Frontend Integration',
        mentalModelHook: 'The API contract is more important than the implementation. Your frontend depends on the shape of the response, not how it was built.',
        analogies: ['API contract as a power outlet standard — the plug shape is agreed on so devices can work anywhere without knowing how the grid works'],
        fundamentalsSlug: 'react-consuming-rails-api',
        fundamentalsBlurb: 'How a React app fetches data from a Rails API: the contract, state management, and error handling',
        firstPass: [],
        reinforce: [],
      },
      {
        id: 'environment-config-and-deployment',
        label: 'Environment Config and Deployment',
        mentalModelHook: "Env vars are the one thing that's different between development and production. They're the seams.",
        analogies: ['Env vars as the ingredients list that changes by location — same recipe, different water source'],
        fundamentalsSlug: 'env-vars-and-render',
        fundamentalsBlurb: 'How environment variables manage config across environments and how to deploy to Render',
        firstPass: [
          { slug: 'deploy-to-render', label: 'Deploy to Render', relatedFundamentalsSlugs: ['env-vars-and-render'] },
        ],
        reinforce: [],
      },
    ],
  },
]

export function getSectionById(sectionId: string): JourneySection | undefined {
  for (const phase of JOURNEY) {
    const section = phase.sections.find((s) => s.id === sectionId)
    if (section) return section
  }
  return undefined
}

export function getPhaseForSection(sectionId: string): Phase | undefined {
  return JOURNEY.find((phase) => phase.sections.some((s) => s.id === sectionId))
}

export function getAllSectionIds(): string[] {
  return JOURNEY.flatMap((phase) => phase.sections.map((s) => s.id))
}

export function getAllScenarioSlugs(): string[] {
  return JOURNEY.flatMap((phase) =>
    phase.sections.flatMap((section) => [
      ...section.firstPass.map((s) => s.slug),
      ...section.reinforce.map((s) => s.slug),
    ])
  )
}

export function getScenarioBySlug(slug: string) {
  for (const phase of JOURNEY) {
    for (const section of phase.sections) {
      const scenario =
        section.firstPass.find((s) => s.slug === slug) ||
        section.reinforce.find((s) => s.slug === slug)
      if (scenario) return { scenario, section, phase }
    }
  }
  return null
}
