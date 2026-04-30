import type { FrontendJourneySection, Phase } from './types';

export const JOURNEY: Phase[] = [
  {
    number: 1,
    label: 'Novice',
    emoji: '🌱',
    goal:
      'Build the core mental models behind TypeScript inference and React hook behavior before the tricky bugs compound.',
    sections: [
      {
        id: 'generics',
        label: 'Generics',
        mentalModelHook:
          'A generic is a function whose input and output shapes stay linked across a call.',
        fundamentalsSlug: 'generics',
        fundamentalsBlurb:
          'Inference, constraints, and when to add a type parameter instead of forcing an annotation.',
      },
      {
        id: 'closure-captures',
        label: 'Closure Captures',
        mentalModelHook:
          'A closure keeps the values from the render where it was created, not the render where it eventually runs.',
        fundamentalsSlug: 'closure-captures',
        fundamentalsBlurb:
          'How stale state appears in handlers, timers, and effects, and what React actually preserves.',
      },
      {
        id: 'effect-semantics',
        label: 'Effect Semantics',
        mentalModelHook:
          'Effects are synchronization steps with setup and cleanup, not a second render phase.',
        fundamentalsSlug: 'effect-semantics',
        fundamentalsBlurb:
          'Lifecycle timing, cleanup correctness, Strict Mode behavior, and when an effect is the wrong tool.',
      },
      {
        id: 'conditional-types',
        label: 'Conditional Types',
        mentalModelHook:
          'A conditional type is a branch at the type level: inspect the input shape, then produce the matching output shape.',
        fundamentalsSlug: 'conditional-types',
        fundamentalsBlurb:
          'Distribution over unions, `infer`, and utility-type mechanics you reuse across typed APIs.',
      },
      {
        id: 'dependency-arrays',
        label: 'Dependency Arrays',
        mentalModelHook:
          'A dependency array is a declaration of what values your effect reads from a render.',
        fundamentalsSlug: 'dependency-arrays',
        fundamentalsBlurb:
          'Why exhaustive-deps exists, what causes loops, and how closure semantics drive the correct dependency list.',
      },
    ],
  },
  {
    number: 2,
    label: 'Studied',
    emoji: '📚',
    goal:
      'Handle the type transforms and hook patterns that look fine at first but break under real product pressure.',
    sections: [
      {
        id: 'mapped-types',
        label: 'Mapped Types',
        mentalModelHook:
          'Mapped types transform an existing object shape property by property while preserving the structural relationship.',
        fundamentalsSlug: 'mapped-types',
        fundamentalsBlurb:
          'Key remapping, modifiers, and the difference between preserving shape and rebuilding it.',
      },
      {
        id: 'ref-vs-state',
        label: 'Ref vs State',
        mentalModelHook:
          'State is for values React should render; refs are for mutable values React should remember without re-rendering.',
        fundamentalsSlug: 'ref-vs-state',
        fundamentalsBlurb:
          'The rendering boundary between refs and state, and how to choose the right storage model.',
      },
      {
        id: 'template-literal-types',
        label: 'Template Literal Types',
        mentalModelHook:
          'Template literal types let you compute valid string shapes instead of hoping string conventions stay consistent.',
        fundamentalsSlug: 'template-literal-types',
        fundamentalsBlurb:
          'Type-safe event names, route shapes, and string composition at the type level.',
      },
      {
        id: 'custom-hook-composition',
        label: 'Custom Hook Composition',
        mentalModelHook:
          'A good custom hook hides orchestration while keeping state ownership and effect boundaries obvious.',
        fundamentalsSlug: 'custom-hook-composition',
        fundamentalsBlurb:
          'How to compose hooks without leaking stale closures, dependency churn, or unclear responsibilities.',
      },
      {
        id: 'branded-types',
        label: 'Branded Types',
        mentalModelHook:
          'A branded type adds proof of meaning to a value that would otherwise be structurally identical.',
        fundamentalsSlug: 'branded-types',
        fundamentalsBlurb:
          'Nominal signals on top of structural typing so IDs, tokens, and validated values stay distinct.',
      },
    ],
  },
  {
    number: 3,
    label: 'Advanced',
    emoji: '🎯',
    goal:
      'Reason about rendering control, type variance, and performance-sensitive React patterns at interview depth.',
    sections: [
      {
        id: 'usereducer-patterns',
        label: 'useReducer Patterns',
        mentalModelHook:
          'A reducer centralizes state transitions so complex UI logic becomes a sequence of explicit events.',
        fundamentalsSlug: 'usereducer-patterns',
        fundamentalsBlurb:
          'Action design, state transitions, and when reducers beat scattered state setters.',
      },
      {
        id: 'variance',
        label: 'Variance',
        mentalModelHook:
          'Variance decides when one generic type can safely stand in for another without breaking reads or writes.',
        fundamentalsSlug: 'variance',
        fundamentalsBlurb:
          'Covariance, contravariance, and the function-parameter rules behind surprising assignment errors.',
      },
      {
        id: 'context-performance',
        label: 'Context Performance',
        mentalModelHook:
          'Context is a broadcast channel: every subscribed consumer hears every change unless you shape the updates carefully.',
        fundamentalsSlug: 'context-performance',
        fundamentalsBlurb:
          'Splitting providers, stabilizing values, and avoiding fan-out re-renders.',
      },
      {
        id: 'concurrent-mode',
        label: 'Concurrent Mode',
        mentalModelHook:
          'Concurrent rendering lets React prepare work opportunistically, so render logic must stay pure and interruption-safe.',
        fundamentalsSlug: 'concurrent-mode',
        fundamentalsBlurb:
          'Transitions, interruptible rendering, and the guarantees React still does and does not make.',
      },
    ],
  },
  {
    number: 4,
    label: 'Data Problems',
    emoji: '🗂️',
    goal:
      'Develop a repeatable approach for data parsing problems: index your source, walk the target, accumulate the answer.',
    sections: [
      {
        id: 'data-parsing',
        label: 'Data Parsing & Cross-Reference',
        mentalModelHook:
          'Data problems become tractable the moment you separate indexing the source from iterating the target.',
        fundamentalsSlug: 'data-parsing',
        fundamentalsBlurb:
          'A progressive framework for solving dataset problems — from flat lookups through cross-reference aggregation to multi-pass pipelines.',
      },
    ],
  },
];

export function getSectionByFundamentalsSlug(
  slug: string,
): FrontendJourneySection | undefined {
  for (const phase of JOURNEY) {
    const section = phase.sections.find(
      (entry) => entry.fundamentalsSlug === slug,
    );
    if (section) return section;
  }

  return undefined;
}

export function getPhaseForSection(sectionId: string): Phase | undefined {
  return JOURNEY.find((phase) =>
    phase.sections.some((section) => section.id === sectionId),
  );
}
