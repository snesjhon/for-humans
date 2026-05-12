import Link from 'next/link';
import { JOURNEY } from '@/lib/frontend/journey';
import { getAllFundamentalsSlugs } from '@/lib/frontend/fundamentals';

export default function FrontendHomePage() {
  const totalPhases = JOURNEY.length;
  const totalSections = JOURNEY.reduce(
    (count, phase) => count + phase.sections.length,
    0,
  );
  const availableGuides = getAllFundamentalsSlugs().length;

  return (
    <>
      <section className="bg-[var(--ms-bg-pane-secondary)] pb-24">
        <div className="mx-auto max-w-[1152px] px-6 pt-[72px]">
          <div className="mb-8">
            <span className="inline-block rounded-full border border-[var(--ms-blue)] bg-[var(--ms-bg-pane)] px-[14px] py-[5px] font-mono text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--ms-blue)]">
              TypeScript + React
            </span>
          </div>

          <h1 className="mb-8 max-w-[860px] font-display text-[clamp(3.4rem,7vw,4rem)] font-normal italic leading-none tracking-[-0.03em] text-[var(--ms-text-body)]">
            Learn frontend
            <br />
            at the mental-model layer.
          </h1>

          <div className="mb-12 grid max-w-[920px] grid-cols-2 gap-x-12 gap-y-6">
            <p className="m-0 text-md leading-[1.75] text-[var(--ms-text-muted)]">
              This track focuses on the bugs and edge cases that catch senior
              engineers off guard: generic inference, stale closures, cleanup
              semantics, dependency churn, and rendering guarantees.
            </p>
            <p className="m-0 text-base leading-[1.75] text-[var(--ms-text-subtle)]">
              It teaches TypeScript and React together, the same way they
              collide in real interviews and real code reviews.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-12">
            <div className="flex gap-10">
              {[
                { value: String(totalPhases), label: 'phases' },
                { value: String(totalSections), label: 'mental models' },
                { value: String(availableGuides), label: 'guides live' },
              ].map(({ value, label }) => (
                <div key={label} className="flex items-baseline gap-[6px]">
                  <span className="font-display text-[3.25rem] font-normal italic leading-none tracking-[-0.04em] text-[var(--ms-blue)]">
                    {value}
                  </span>
                  <span className="text-[0.8125rem] font-medium text-[var(--ms-text-faint)]">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="ml-auto">
              <Link
                href="/frontend"
                className="rounded-[7px] bg-[var(--ms-blue)] px-7 py-[11px] text-[0.9375rem] font-semibold text-white no-underline"
              >
                Explore the frontend path →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-y-[var(--ms-surface)] bg-[var(--ms-bg-pane)]">
        <div className="mx-auto grid max-w-[1152px] grid-cols-2 px-6">
          <div className="border-r border-r-[var(--ms-surface)] py-10 pr-10">
            <div className="mb-4 font-mono text-[0.62rem] font-bold uppercase tracking-[0.1em] text-[var(--ms-text-faint)]">
              Most prep
            </div>
            <h2 className="mb-[14px] font-display text-[1.625rem] font-normal italic leading-[1.2] tracking-[-0.02em] text-[var(--ms-text-body)]">
              Memorizes APIs and misses the model.
            </h2>
            <p className="m-0 text-[0.9375rem] leading-[1.8] text-[var(--ms-text-subtle)]">
              That works until the interview shifts from syntax to semantics:
              why the closure is stale, why the effect loops, why the generic
              widened, or why the context update repaints everything.
            </p>
          </div>

          <div className="py-10 pl-10">
            <div className="mb-4 font-mono text-[0.62rem] font-bold uppercase tracking-[0.1em] text-[var(--ms-blue)]">
              This path
            </div>
            <h2 className="mb-[14px] font-display text-[1.625rem] font-normal italic leading-[1.2] tracking-[-0.02em] text-[var(--ms-text-body)]">
              Builds the explanation before the fix.
            </h2>
            <p className="m-0 text-[0.9375rem] leading-[1.8] text-[var(--ms-text-subtle)]">
              Every section isolates a failure mode, then teaches the invariant
              behind it so the right implementation becomes obvious instead of
              memorized.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
