import type { Phase, JourneySection } from './types'

export const JOURNEY: Phase[] = [
  // ─────────────────────────────────────────────────────────────────
  // PHASE 1: NOVICE
  // ─────────────────────────────────────────────────────────────────
  {
    number: 1,
    label: 'Novice',
    emoji: '🌱',
    goal: 'Build foundational design intuition with systems you can visualize and reason about concretely.',
    sections: [
      {
        id: 'data-modeling',
        label: 'Data Modeling & Schema Design',
        mentalModelHook: 'Every system is just entities and relationships. Before you think about scale, think about what you\'re storing and why.',
        analogies: ['Entities as nouns, relationships as verbs', 'Schema as a contract with the future'],
        fundamentalsSlug: 'data-modeling',
        fundamentalsBlurb: 'Entity identification, relationship mapping, normalization trade-offs, and constraints as data integrity guarantees — before any system can scale, it needs a solid schema.',
        firstPass: [
          {
            slug: 'yogurt-ordering-system',
            label: 'Design a Yogurt Ordering System',
            relatedFundamentalsSlugs: ['data-modeling'],
          },
          {
            slug: 'user-profile-auth-schema',
            label: 'Design a User Profile and Authentication Schema',
            relatedFundamentalsSlugs: ['data-modeling'],
          },
        ],
        reinforce: [],
      },
      {
        id: 'api-design',
        label: 'API Design',
        mentalModelHook: 'An API is a contract between you and your consumers. Design for the consumer, not the implementation.',
        analogies: ['REST resources as nouns, methods as verbs', 'Status codes as intent, not just numbers'],
        fundamentalsSlug: 'api-design',
        fundamentalsBlurb: 'REST resource modeling, HTTP method semantics, status codes as contracts, versioning strategies, and response shape design — the surface area that consumers depend on.',
        firstPass: [],
        reinforce: [],
      },
      {
        id: 'relational-databases',
        label: 'Relational Databases',
        mentalModelHook: 'Tables are truth. Indexes are shortcuts. Joins are the price you pay for normalization.',
        analogies: ['Index as a book\'s index — lookup first, read second', 'Transaction as an all-or-nothing promise'],
        firstPass: [],
        reinforce: [],
      },
      {
        id: 'caching-fundamentals',
        label: 'Caching Fundamentals',
        mentalModelHook: 'A cache is a bet — you\'re trading consistency for speed. Know what you\'re willing to lose.',
        analogies: ['Cache as a sticky note on your desk vs filing cabinet', 'TTL as an expiry date on food'],
        firstPass: [],
        reinforce: [],
      },
      {
        id: 'scalability-fundamentals',
        label: 'Scalability Fundamentals',
        mentalModelHook: 'Stateless services scale horizontally. State is the hard part.',
        analogies: ['Horizontal scaling as adding more cashiers', 'Stateless as a vending machine vs a personal shopper'],
        firstPass: [],
        reinforce: [],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // PHASE 2: STUDIED
  // ─────────────────────────────────────────────────────────────────
  {
    number: 2,
    label: 'Studied',
    emoji: '📚',
    goal: 'Think in distributed systems. Reason about trade-offs under scale, failure, and concurrency.',
    sections: [
      {
        id: 'database-scaling',
        label: 'Database Scaling',
        mentalModelHook: 'You scale reads first (replicas), then writes (sharding). Never shard before you have to.',
        analogies: ['Read replica as a photocopied menu at a busy restaurant', 'Shard key as a library\'s Dewey Decimal system'],
        firstPass: [],
        reinforce: [],
      },
      {
        id: 'consistent-hashing',
        label: 'Consistent Hashing',
        mentalModelHook: 'When your hash space is fixed, adding or removing nodes reshuffles every key. Consistent hashing limits that chaos to neighbors only.',
        analogies: ['Hash ring as a clock face — nodes sit at positions, keys find the next clockwise node'],
        firstPass: [],
        reinforce: [],
      },
      {
        id: 'message-queues',
        label: 'Message Queues & Async Processing',
        mentalModelHook: 'A queue decouples the producer from the consumer. You send a message and forget — the queue handles delivery.',
        analogies: ['Queue as a postal service — drop the letter, walk away', 'Dead letter queue as the undeliverable mail pile'],
        firstPass: [],
        reinforce: [],
      },
      {
        id: 'cap-theorem',
        label: 'CAP Theorem & Consistency Models',
        mentalModelHook: 'When the network partitions, you must choose: serve stale data or refuse to answer. There is no third option.',
        analogies: ['CP as a bank that closes rather than risk a bad balance', 'AP as a scoreboard that might be a second behind'],
        firstPass: [],
        reinforce: [],
      },
      {
        id: 'rate-limiting',
        label: 'Rate Limiting',
        mentalModelHook: 'Rate limiting protects resources from being overwhelmed. You\'re not rejecting users — you\'re enforcing fairness.',
        analogies: ['Token bucket as a bucket that refills at a fixed rate', 'Sliding window as a moving snapshot of recent requests'],
        firstPass: [],
        reinforce: [],
      },
      {
        id: 'storage-cdn',
        label: 'Storage & CDN',
        mentalModelHook: 'CDNs move data closer to users. Storage tiers match access frequency. Hot data costs more to store fast.',
        analogies: ['CDN edge node as a convenience store near your house vs a warehouse far away', 'Object storage as infinite cheap shelving'],
        firstPass: [],
        reinforce: [],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // PHASE 3: EXPERT
  // ─────────────────────────────────────────────────────────────────
  {
    number: 3,
    label: 'Expert',
    emoji: '🎯',
    goal: 'Combine Phase 1 and Phase 2 concepts into complex, production-grade systems.',
    sections: [
      {
        id: 'distributed-transactions',
        label: 'Distributed Transactions',
        mentalModelHook: 'ACID is easy on one machine. On multiple machines, you orchestrate it yourself.',
        analogies: ['Two-phase commit as getting two people to agree to meet before either leaves home', 'Saga as a series of reversible steps with compensating actions'],
        firstPass: [],
        reinforce: [],
      },
      {
        id: 'real-time-systems',
        label: 'Real-time Systems',
        mentalModelHook: 'Real-time is a spectrum. Polling is lazy pull. WebSockets is a persistent connection. SSE is a one-way stream.',
        analogies: ['Polling as checking your mailbox every hour', 'WebSocket as a phone call that stays open', 'SSE as a radio broadcast'],
        firstPass: [],
        reinforce: [],
      },
      {
        id: 'search-systems',
        label: 'Search Systems',
        mentalModelHook: 'Full-text search is an inverted index — you look up words to find documents, not documents to find words.',
        analogies: ['Inverted index as a book\'s index at the back — look up the word, find the page'],
        firstPass: [],
        reinforce: [],
      },
      {
        id: 'observability',
        label: 'Observability & Monitoring',
        mentalModelHook: 'You can\'t fix what you can\'t see. Logs are events, metrics are trends, traces are journeys.',
        analogies: ['Logs as a diary, metrics as a dashboard, traces as a GPS breadcrumb trail'],
        firstPass: [],
        reinforce: [],
      },
      {
        id: 'microservices',
        label: 'Microservices vs Monolith',
        mentalModelHook: 'Microservices trade operational simplicity for deployment flexibility. Only split when the monolith\'s coupling is hurting you.',
        analogies: ['Monolith as one big Swiss Army knife vs microservices as a toolbox of specialized tools'],
        firstPass: [],
        reinforce: [],
      },
    ],
  },
]

export function getSectionById(sectionId: string): JourneySection | undefined {
  for (const phase of JOURNEY) {
    const section = phase.sections.find(s => s.id === sectionId)
    if (section) return section
  }
  return undefined
}

export function getPhaseForSection(sectionId: string): Phase | undefined {
  return JOURNEY.find(phase => phase.sections.some(s => s.id === sectionId))
}

export function getAllSectionIds(): string[] {
  return JOURNEY.flatMap(phase => phase.sections.map(s => s.id))
}

export function getAllScenarioSlugs(): string[] {
  return JOURNEY.flatMap(phase =>
    phase.sections.flatMap(section => [
      ...section.firstPass.map(s => s.slug),
      ...section.reinforce.map(s => s.slug),
    ])
  )
}

export function getScenarioBySlug(slug: string) {
  for (const phase of JOURNEY) {
    for (const section of phase.sections) {
      const scenario =
        section.firstPass.find(s => s.slug === slug) ||
        section.reinforce.find(s => s.slug === slug)
      if (scenario) return { scenario, section, phase }
    }
  }
  return null
}
