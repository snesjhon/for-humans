import Link from 'next/link';
import { JOURNEY } from '@/lib/interview-prep/journey';
import { getAllFundamentalsSlugs } from '@/lib/interview-prep/fundamentals';

export default function InterviewPrepHomePage() {
  const totalPhases = JOURNEY.length;
  const totalTopics = JOURNEY.reduce(
    (count, phase) => count + phase.items.length,
    0,
  );
  const publishedFundamentals = getAllFundamentalsSlugs().length;

  return (
    <>
      <section className="bg-[var(--ms-bg-pane-secondary)] pb-24">
        <div className="mx-auto max-w-[1152px] px-6 pt-[72px]">
          <div className="mb-8">
            <span className="inline-block rounded-full border border-[var(--ms-blue)] bg-[var(--ms-bg-pane)] px-[14px] py-[5px] font-mono text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--ms-blue)]">
              React Interview Prep
            </span>
          </div>

          <h1 className="mb-8 max-w-[860px] font-display text-[clamp(3.2rem,7vw,4rem)] font-normal italic leading-none tracking-[-0.03em] text-[var(--ms-text-body)]">
            Build one dashboard
            <br />
            you can actually walk through.
          </h1>

          <div className="mb-12 grid max-w-[920px] grid-cols-2 gap-x-12 gap-y-6">
            <p className="m-0 text-md leading-[1.75] text-[var(--ms-text-muted)]">
              This track is one continuous project: a Plant Floor Monitor that
              starts at the API contract and ends at the interview walkthrough.
            </p>
            <p className="m-0 text-base leading-[1.75] text-[var(--ms-text-subtle)]">
              Each topic pairs a fundamentals guide with a scenario. Read the
              guide to install the mental model, then prove it holds under
              the scenario.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-12">
            <div className="flex gap-10">
              {[
                { value: String(totalPhases), label: 'project phase' },
                { value: String(totalTopics), label: 'topics' },
                { value: String(publishedFundamentals), label: 'guides published' },
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
                href="/interview-prep/path"
                className="rounded-[7px] bg-[var(--ms-blue)] px-7 py-[11px] text-[0.9375rem] font-semibold text-white no-underline"
              >
                Open the project path →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-y-[var(--ms-surface)] bg-[var(--ms-bg-pane)]">
        <div className="mx-auto grid max-w-[1152px] grid-cols-2 px-6">
          <div className="border-r border-r-[var(--ms-surface)] py-10 pr-10">
            <div className="mb-4 font-mono text-[0.62rem] font-bold uppercase tracking-[0.1em] text-[var(--ms-text-faint)]">
              Typical prep
            </div>
            <h2 className="mb-[14px] font-display text-[1.625rem] font-normal italic leading-[1.2] tracking-[-0.02em] text-[var(--ms-text-body)]">
              Solves isolated questions without a project story.
            </h2>
            <p className="m-0 text-[0.9375rem] leading-[1.8] text-[var(--ms-text-subtle)]">
              That leaves candidates able to name hooks and APIs but weak on
              explaining architecture, tradeoffs, and how the pieces connect in
              a real codebase.
            </p>
          </div>

          <div className="py-10 pl-10">
            <div className="mb-4 font-mono text-[0.62rem] font-bold uppercase tracking-[0.1em] text-[var(--ms-blue)]">
              This path
            </div>
            <h2 className="mb-[14px] font-display text-[1.625rem] font-normal italic leading-[1.2] tracking-[-0.02em] text-[var(--ms-text-body)]">
              Builds something small enough to finish and strong enough to defend.
            </h2>
            <p className="m-0 text-[0.9375rem] leading-[1.8] text-[var(--ms-text-subtle)]">
              The learner leaves with one coherent dashboard, a typed data flow,
              and a credible explanation of why each layer is shaped the way it is.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
