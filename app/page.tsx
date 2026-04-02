import Link from 'next/link';
import { JOURNEY } from '@/lib/dsa/journey';
import { getAllProblems } from '@/lib/dsa/content';
import {
  HOW_IT_WORKS,
  FUNDAMENTALS_DATA,
  MENTAL_MODELS_DATA,
} from '@/lib/dsa/homepage-data';
import { CodeEditorMockup } from '@/components/dsa/homepage/CodeEditorMockup/CodeEditorMockup';
import { TracerMockup } from '@/components/dsa/homepage/TracerMockup/TracerMockup';
import { MentalModelMockup } from '@/components/dsa/homepage/MentalModelMockup/MentalModelMockup';
import { AppTheme } from '@/components/ui/AppTheme/AppTheme';

export default function HomePage() {
  const allProblems = getAllProblems();

  const totalProblems = allProblems.length;
  const totalPhases = JOURNEY.length;
  const totalSections = JOURNEY.reduce((acc, p) => acc + p.sections.length, 0);

  return (
    <>
      <AppTheme app="dsa" />
      <section className="-mt-28 bg-[var(--bg-alt)] pb-28">
        <div className="max-w-[1152px] mx-auto pt-[118px] px-6">
          <div className="mb-8">
            <span
              className="font-mono text-[0.68rem] font-bold tracking-[0.12em] uppercase inline-block py-[5px] px-[14px] rounded-full text-[var(--primary)] bg-[var(--bg)] border border-[var(--primary)]"
            >
              A structured learning path
            </span>
          </div>

          <h1 className="font-display italic font-normal leading-none tracking-[-0.03em] mb-10 max-w-[860px] text-[var(--fg)] text-[clamp(3.5rem,7vw,4rem)]">
            Learn DSA the way
            <br />
            it should be taught.
          </h1>

          <div className="grid grid-cols-2 gap-x-12 gap-y-6 max-w-[900px] mb-[52px]">
            <p className="text-md leading-[1.75] m-0 text-[var(--fg-alt)]">
              Most DSA study is backwards — grinding problems until solutions
              stick by accident. This path builds{' '}
              <strong className="font-bold text-[var(--primary)]">
                mental models first
              </strong>
              . Understand the <em>why</em> before writing a line of code.
            </p>
            <p className="text-base leading-[1.75] m-0 text-[var(--fg-comment)]">
              The result: you recognize what kind of problem you&apos;re looking
              at — not because you memorized the solution, but because the
              intuition is actually yours.
            </p>
          </div>

          <div className="flex items-center gap-12 flex-wrap">
            <div className="flex gap-10">
              {[
                {
                  value: String(totalPhases),
                  label: 'phases',
                  color: 'var(--primary)',
                },
                {
                  value: String(totalSections),
                  label: 'mental models',
                  color: 'var(--primary)',
                },
                {
                  value: String(totalProblems),
                  label: 'problems',
                  color: 'var(--primary)',
                },
              ].map(({ value, label, color }) => (
                <div key={label} className="flex items-baseline gap-[6px]">
                  <span className="font-display italic font-normal text-[3.25rem] leading-none tracking-[-0.04em] text-[var(--primary)]">
                    {value}
                  </span>
                  <span className="text-[0.8125rem] font-medium text-[var(--fg-gutter)]">
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <div className="ml-auto">
              <Link
                href="/dsa/path"
                className="py-[11px] px-7 rounded-[7px] font-semibold text-[0.9375rem] text-white no-underline bg-[var(--primary)]"
              >
                Start the learning path →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM / CONTRAST ──────────────────────────────────────────── */}
      <section className="border-y border-y-[var(--border)] bg-[var(--bg)]">
        <div className="max-w-[1152px] mx-auto px-6 grid grid-cols-2">
          <div className="py-10 pr-10 border-r border-r-[var(--border)]">
            <div className="font-mono text-[0.62rem] font-bold tracking-[0.1em] uppercase mb-4 text-[var(--fg-gutter)]">
              The usual approach
            </div>
            <h2 className="font-display italic font-normal text-[1.625rem] leading-[1.2] tracking-[-0.02em] mb-[14px] text-[var(--fg)]">
              Grinding leaves too much to chance.
            </h2>
            <p className="text-[0.9375rem] leading-[1.8] m-0 text-[var(--fg-comment)]">
              Solving 200 random problems teaches you 200 solutions. Ask
              yourself which ones you could reproduce cold — without the label,
              without having seen it recently. Pattern matching by accident
              doesn&apos;t transfer to problems you haven&apos;t seen before.
            </p>
          </div>
          <div className="py-10 pl-10">
            <div className="font-mono text-[0.62rem] font-bold tracking-[0.1em] uppercase mb-4 text-[var(--primary)]">
              This path
            </div>
            <h2 className="font-display italic font-normal text-[1.625rem] leading-[1.2] tracking-[-0.02em] mb-[14px] text-[var(--fg)]">
              Real pattern recognition is built deliberately.
            </h2>
            <p className="text-[0.9375rem] leading-[1.8] m-0 text-[var(--fg-comment)]">
              This path teaches you to see the structure of a problem — not
              because you&apos;ve seen it before, but because you understand the
              underlying pattern. That understanding transfers to problems
              you&apos;ve never encountered.
            </p>
          </div>
        </div>
      </section>

      {/* ── FUNDAMENTALS GALLERY ────────────────────────────────────────────── */}
      <section className="bg-[var(--bg)] border-t border-t-[var(--border)]">
        <div className="max-w-[1152px] mx-auto px-6 pt-[72px] pb-[80px]">
          <div className="mb-12 flex items-end justify-between gap-8 flex-wrap">
            <div>
              <div className="flex items-center gap-[10px] mb-3">
                <span className="font-mono text-[0.62rem] font-bold tracking-[0.1em] uppercase text-[var(--fg-gutter)]">
                  Step 1
                </span>
                <span className="w-6 h-px inline-block bg-[var(--border)]" />
                <span className="font-mono text-[0.62rem] font-bold tracking-[0.1em] uppercase text-[var(--primary)]">
                  Build the foundation
                </span>
              </div>
              <h2 className="font-display italic font-normal text-[2.25rem] leading-[1.1] tracking-[-0.03em] mb-[14px] max-w-[580px] text-[var(--fg)]">
                Every data structure gets its own mental model.
              </h2>
              <p className="text-[0.9375rem] leading-[1.75] m-0 max-w-[520px] text-[var(--fg-comment)]">
                Before you encounter a single problem, you understand the tools
                you&apos;ll use to solve them — each one through a single
                real-world analogy that makes the structure obvious.
              </p>
            </div>
            <Link
              href="/dsa/path"
              className="font-mono text-[0.72rem] font-semibold no-underline whitespace-nowrap py-2 px-4 rounded-[5px] shrink-0 text-[var(--fg-alt)] border border-[var(--border)] bg-[var(--bg-alt)]"
            >
              Explore fundamentals →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {FUNDAMENTALS_DATA.map(
              ({ slug, name, analogy, excerpt, tags, accent, Visual }, idx) => (
                <div
                  key={slug}
                  className={`flex flex-row overflow-hidden rounded-[0.875rem] border border-[var(--border)] bg-[var(--bg)] ${
                    idx === 4 ? 'col-span-2' : ''
                  }`}
                >
                  <div className="flex w-[220px] shrink-0 items-center justify-center border-r border-r-[var(--border)] bg-[var(--primary-tint)]">
                    <Visual />
                  </div>
                  <div className="flex-1 py-7 px-8 flex flex-col justify-between min-h-[180px]">
                    <div>
                      <div className="font-mono text-[0.58rem] font-bold tracking-[0.08em] uppercase mb-2 text-[var(--fg-gutter)]">
                        Fundamentals
                      </div>
                      <div className="text-[1.0625rem] font-bold mb-[6px] leading-[1.25] text-[var(--fg)]">
                        {name}
                      </div>
                      <div className="mb-[14px] font-display text-[1.25rem] italic font-normal leading-[1.15] tracking-[-0.02em] text-[var(--primary)]">
                        {analogy}
                      </div>
                      <p className="text-[0.9rem] leading-[1.75] m-0 text-[var(--fg-comment)]">
                        {excerpt}
                      </p>
                    </div>
                    <div className="flex gap-[6px] flex-wrap mt-5">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[0.58rem] font-semibold py-[3px] px-2 rounded text-[var(--fg-gutter)] bg-[var(--bg-alt)] border border-[var(--border)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── MENTAL MODELS GALLERY ───────────────────────────────────────────── */}
      <section className="bg-[var(--bg-alt)] border-t border-t-[var(--border)]">
        <div className="max-w-[1152px] mx-auto px-6 pt-[72px] pb-[80px]">
          <div className="mb-[52px] flex items-end justify-between gap-8 flex-wrap">
            <div>
              <div className="flex items-center gap-[10px] mb-3">
                <span className="font-mono text-[0.62rem] font-bold tracking-[0.1em] uppercase text-[var(--fg-gutter)]">
                  Step 2
                </span>
                <span className="w-6 h-px inline-block bg-[var(--border)]" />
                <span className="font-mono text-[0.62rem] font-bold tracking-[0.1em] uppercase text-[var(--primary)]">
                  Apply the foundation
                </span>
              </div>
              <h2 className="font-display italic font-normal text-[2.25rem] leading-[1.1] tracking-[-0.03em] mb-[14px] max-w-[560px] text-[var(--fg)]">
                Then tackle real algorithms — with a story for each.
              </h2>
              <p className="text-[0.9375rem] leading-[1.75] m-0 max-w-[520px] text-[var(--fg-comment)]">
                Each problem gets its own analogy. You already know the tools —
                now you learn exactly which one applies, and why, before writing
                a line of code.
              </p>
            </div>
            <Link
              href="/dsa/path"
              className="font-mono text-[0.72rem] font-semibold no-underline whitespace-nowrap py-2 px-4 rounded-[5px] shrink-0 text-[var(--fg-alt)] border border-[var(--border)] bg-[var(--bg)]"
            >
              Browse all problems →
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {MENTAL_MODELS_DATA.map(
              ({
                id,
                name,
                difficulty,
                diffColor,
                analogy,
                excerpt,
                tags,
                accent,
                Visual,
              }) => (
                <div
                  key={id}
                  className="overflow-hidden rounded-[0.875rem] flex flex-col transition-shadow duration-[150ms] border border-[var(--border)] bg-[var(--bg)]"
                >
                  <div className="min-h-[128px] border-b border-b-[var(--border)] bg-[var(--primary-tint)]">
                    <Visual />
                  </div>
                  <div className="pt-[14px] px-4 pb-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-[7px] mb-[9px]">
                      <span className="font-mono text-[0.55rem] font-bold tracking-[0.04em] text-[var(--fg-gutter)]">
                        {id}
                      </span>
                      <span className="w-px h-2 inline-block bg-[var(--border)]" />
                      <span className="text-[0.75rem] font-semibold text-[var(--fg)]">
                        {name}
                      </span>
                      <span
                        className={`font-mono ml-auto shrink-0 rounded-[3px] px-[6px] py-[2px] text-[0.5rem] font-bold uppercase tracking-[0.08em] ${
                          difficulty === 'Easy'
                            ? 'bg-[var(--green-tint)] text-[var(--green)]'
                            : difficulty === 'Medium'
                              ? 'bg-[var(--orange-tint)] text-[var(--orange)]'
                              : 'bg-[var(--red-tint)] text-[var(--red)]'
                        }`}
                      >
                        {difficulty}
                      </span>
                    </div>
                    <div className="mb-2 font-display text-[1.0625rem] italic font-normal leading-[1.2] tracking-[-0.01em] text-[var(--primary)]">
                      {analogy}
                    </div>
                    <p className="text-[0.8125rem] leading-[1.7] mb-3 flex-1 text-[var(--fg-comment)]">
                      {excerpt}
                    </p>
                    <div className="flex gap-[5px] flex-wrap">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[0.56rem] font-semibold py-[3px] px-[7px] rounded-[3px] text-[var(--fg-gutter)] bg-[var(--bg-alt)] border border-[var(--border)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── VISUAL SHOWCASE ─────────────────────────────────────────────────── */}
      <section className="bg-[var(--bg)]">
        <div className="max-w-[1152px] mx-auto px-6 pt-[72px] pb-[80px]">
          <div className="mb-[52px]">
            <div className="font-mono text-[0.62rem] font-bold tracking-[0.1em] uppercase mb-3 text-[var(--fg-gutter)]">
              Inside a lesson
            </div>
            <h2 className="font-display italic font-normal text-[2.25rem] leading-[1.1] tracking-[-0.03em] m-0 max-w-[540px] text-[var(--fg)]">
              Every step of learning is intentional.
            </h2>
          </div>

          <div className="grid gap-x-14 gap-y-10 mb-10 items-center grid-cols-[1.1fr_0.9fr]">
            <TracerMockup />
            <div>
              <div className="font-mono text-[0.6rem] font-bold tracking-[0.1em] uppercase mb-3 text-[var(--primary)]">
                Visual Tracers
              </div>
              <h3 className="font-display italic font-normal text-[1.75rem] leading-[1.15] tracking-[-0.025em] mb-[14px] text-[var(--fg)]">
                See the algorithm run before you write a line.
              </h3>
              <p className="text-[0.9375rem] leading-[1.8] mb-5 text-[var(--fg-comment)]">
                Interactive step-through tracers let you advance frame by frame
                — watching each variable change, each array cell light up, the
                state evolving visually before you ever touch the keyboard.
              </p>
              <p className="text-[0.9375rem] leading-[1.8] m-0 text-[var(--fg-comment)]">
                The algorithm stops being abstract. You can <em>see</em> exactly
                what it&apos;s doing at every step.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 items-start">
            <div>
              <CodeEditorMockup />
              <div className="pt-5 px-1 pb-0">
                <div className="font-mono text-[0.6rem] font-bold tracking-[0.1em] uppercase mb-2 text-[var(--primary)]">
                  Step-by-Step Building
                </div>
                <h3 className="font-display italic font-normal text-[1.375rem] leading-[1.2] tracking-[-0.02em] mb-[10px] text-[var(--fg)]">
                  Build the algorithm yourself.
                </h3>
                <p className="text-[0.875rem] leading-[1.75] m-0 text-[var(--fg-comment)]">
                  Each concept unlocks incrementally inside a real in-browser
                  editor. You write the solution — guided, but never handed the
                  answer.
                </p>
              </div>
            </div>

            <div>
              <MentalModelMockup />
              <div className="pt-5 px-1 pb-0">
                <div className="font-mono text-[0.6rem] font-bold tracking-[0.1em] uppercase mb-2 text-[var(--primary)]">
                  Mental Models
                </div>
                <h3 className="font-display italic font-normal text-[1.375rem] leading-[1.2] tracking-[-0.02em] mb-[10px] text-[var(--fg)]">
                  Every pattern has an unforgettable analogy.
                </h3>
                <p className="text-[0.875rem] leading-[1.75] m-0 text-[var(--fg-comment)]">
                  Before any code appears, the pattern is explained through a
                  single real-world metaphor you won&apos;t forget. The
                  algorithm becomes obvious once the intuition is there.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section className="border-t border-t-[var(--border)]">
        <div className="max-w-[1152px] mx-auto px-6">
          <div className="pt-12 pb-8 border-b border-b-[var(--border)]">
            <div className="font-mono text-[0.62rem] font-bold tracking-[0.1em] uppercase mb-2 text-[var(--fg-gutter)]">
              The loop
            </div>
            <h2 className="font-display italic font-normal text-[1.625rem] leading-[1.2] tracking-[-0.025em] m-0 text-[var(--fg)]">
              Three steps. Repeated across every section.
            </h2>
          </div>
          <div className="grid grid-cols-3">
            {HOW_IT_WORKS.map(({ step, heading, body, color }, i) => (
              <div
                key={step}
                className={`bg-[var(--bg-alt)] px-9 py-10 ${
                  i < 2 ? 'border-r border-r-[var(--border)]' : ''
                }`}
              >
                <div className="mb-[18px] select-none font-display text-[3.25rem] italic font-normal leading-none tracking-[-0.05em] text-[var(--border-dark)]">
                  {step}
                </div>
                <div className="font-bold text-[1.0625rem] leading-[1.25] mb-3 text-[var(--fg)]">
                  {heading}
                </div>
                <div className="mb-[14px] h-[3px] w-9 rounded-[2px] bg-[var(--primary)]" />
                <p className="text-[0.9375rem] leading-[1.75] m-0 text-[var(--fg-alt)]">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ──────────────────────────────────────────────────────── */}
      <section className="border-t border-t-[var(--border)] bg-[var(--bg-alt)]">
        <div className="max-w-[1152px] mx-auto px-6 pt-[72px] pb-[80px] flex items-end justify-between gap-10 flex-wrap">
          <div>
            <h2 className="font-display italic font-normal text-[2.5rem] leading-[1.1] tracking-[-0.03em] mb-3 max-w-[520px] text-[var(--fg)]">
              Ready to build real intuition?
            </h2>
            <p className="text-[0.9375rem] leading-[1.7] m-0 max-w-[440px] text-[var(--fg-comment)]">
              The path starts with the fundamentals and scales to expert-level
              techniques — one mental model at a time.
            </p>
          </div>
          <Link
            href="/dsa/path"
            className="py-[13px] px-8 rounded-[7px] font-semibold text-base text-white no-underline shrink-0 bg-[var(--primary)]"
          >
            View the path →
          </Link>
        </div>
      </section>
    </>
  );
}
