const W = 'max-w-[1200px] mx-auto px-6';

const sectionBase =
  'border-t border-dashed border-[var(--ms-surface)] py-20 relative';

function Kicker({
  children,
  muted,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <p
      className={`font-[var(--font-mono)] text-[11px] tracking-[0.14em] uppercase m-0 ${muted ? 'text-[var(--ms-text-faint)]' : 'text-[var(--ms-blue)]'}`}
    >
      {children}
    </p>
  );
}

function Btn({
  primary,
  children,
}: {
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg font-[var(--font-body)] font-medium text-sm cursor-pointer border transition-all ${
        primary
          ? 'bg-[var(--ms-blue)] text-[var(--ms-base)] border-[var(--ms-blue)] hover:opacity-90'
          : 'bg-transparent text-[var(--ms-text-body)] border-[var(--ms-surface)] hover:border-[var(--ms-text-muted)]'
      }`}
    >
      {children}
    </button>
  );
}

function Footer() {
  return (
    <div className={W}>
      <footer className="py-10 border-t border-[var(--ms-surface)] mt-10 flex justify-between items-baseline gap-5 flex-wrap font-[var(--font-mono)] text-[11px] text-[var(--ms-text-faint)] tracking-[0.08em]">
        <span>© 2026 &nbsp;·&nbsp; thinkdeep.systems</span>
        <em className="font-[var(--font-display)] not-italic italic text-[13px] text-[var(--ms-text-muted)]">
          Build the thinking, not just the code.
        </em>
      </footer>
    </div>
  );
}

function AtlasNode({
  x,
  y,
  type,
  children,
}: {
  x: string;
  y: string;
  type: 'core' | 'done' | 'normal' | 'locked';
  children: React.ReactNode;
}) {
  const base =
    'absolute py-2.5 px-3.5 rounded-lg font-[var(--font-mono)] text-[11px] whitespace-nowrap border shadow-[0_1px_2px_rgba(76,79,105,0.06)]';
  const styles = {
    core: 'border-[var(--ms-blue)] bg-[color-mix(in_srgb,var(--ms-blue)_10%,var(--ms-bg-pane))] text-[var(--ms-blue)] font-medium',
    done: 'border-[var(--ms-green)] bg-[color-mix(in_srgb,var(--ms-green)_10%,var(--ms-bg-pane))] text-[var(--ms-green)]',
    normal:
      'border-[var(--ms-surface)] bg-[var(--ms-bg-pane)] text-[var(--ms-text-body)]',
    locked:
      'border-dashed border-[var(--ms-surface)] bg-[var(--ms-bg-pane)] text-[var(--ms-text-body)] opacity-50',
  };
  return (
    <div
      className={`${base} ${styles[type]}`}
      style={{ left: x, top: y, transform: 'translate(-50%,-50%)' }}
    >
      {children}
    </div>
  );
}

const GLOSSARY = [
  {
    term: 'Invariant',
    type: 'dsa · core',
    def: 'a condition that must stay true at every step.',
  },
  {
    term: 'Amortized',
    type: 'dsa',
    def: 'the cost averaged over time, not per-call.',
  },
  {
    term: 'Back-pressure',
    type: 'sys·des · core',
    def: 'how a slow consumer signals upstream.',
  },
  {
    term: 'Idempotence',
    type: 'sys·des',
    def: 'running it twice leaves the same state.',
  },
  {
    term: 'Tail latency',
    type: 'sys·des',
    def: 'the p99 that ruins your average.',
  },
  {
    term: 'Coupling',
    type: 'fs',
    def: 'what breaks together when one thing moves.',
  },
  {
    term: 'Quorum',
    type: 'sys·des',
    def: 'the minimum agreement to make progress.',
  },
  {
    term: 'Contract',
    type: 'fs',
    def: 'the promise between two moving parts.',
  },
];

export default function HomePage() {
  return (
    <main>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section
        data-home-hero
        className="relative overflow-hidden border-t-0 text-center flex items-start justify-center"
        style={{ padding: '100px 0 60px', minHeight: '600px' }}
      >
        {/* Animated concept-web background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 0 }}
          aria-hidden
        >
          <svg
            viewBox="0 0 1200 720"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 w-full h-full"
          >
            {/* edges */}
            <g>
              <path className="web-edge" d="M 80 200 L 200 180"/>
              <path className="web-edge" d="M 200 180 L 360 140"/>
              <path className="web-edge active" d="M 200 180 Q 360 140 520 260"/>
              <path className="web-edge" d="M 360 140 L 520 260"/>
              <path className="web-edge" d="M 520 260 L 680 180"/>
              <path className="web-edge" d="M 680 180 L 860 240"/>
              <path className="web-edge" d="M 860 240 L 1040 180"/>
              <path className="web-edge" d="M 1040 180 L 1160 260"/>
              <path className="web-edge active" d="M 1020 220 Q 880 340 720 300"/>
              <path className="web-edge" d="M 200 180 L 140 360"/>
              <path className="web-edge" d="M 360 140 L 420 340"/>
              <path className="web-edge" d="M 520 260 L 600 440"/>
              <path className="web-edge" d="M 680 180 L 820 540"/>
              <path className="web-edge" d="M 860 240 L 820 540"/>
              <path className="web-edge" d="M 1040 180 L 1020 440"/>
              <path className="web-edge" d="M 60 420 L 140 360"/>
              <path className="web-edge active" d="M 140 360 Q 300 300 460 380"/>
              <path className="web-edge" d="M 140 360 L 260 500"/>
              <path className="web-edge" d="M 260 500 L 420 340"/>
              <path className="web-edge" d="M 420 340 L 600 440"/>
              <path className="web-edge" d="M 600 440 L 820 540"/>
              <path className="web-edge active" d="M 420 520 Q 600 440 820 540"/>
              <path className="web-edge" d="M 820 540 L 1020 440"/>
              <path className="web-edge" d="M 1020 440 L 1160 500"/>
              <path className="web-edge" d="M 260 500 L 360 620"/>
              <path className="web-edge" d="M 600 440 L 540 640"/>
              <path className="web-edge" d="M 820 540 L 900 660"/>
            </g>
            {/* nodes */}
            <g>
              <circle className="web-node"        cx="80"   cy="200" r="3"/>
              <circle className="web-node anchor" cx="200"  cy="180" r="6"/>
              <circle className="web-halo"        cx="200"  cy="180" r="6"/>
              <circle className="web-node done"   cx="360"  cy="140" r="5"/>
              <circle className="web-node"        cx="520"  cy="260" r="5"/>
              <circle className="web-node"        cx="680"  cy="180" r="4"/>
              <circle className="web-node"        cx="860"  cy="240" r="5"/>
              <circle className="web-node"        cx="1040" cy="180" r="5"/>
              <circle className="web-node"        cx="1160" cy="260" r="3"/>
              <circle className="web-node"        cx="60"   cy="420" r="3"/>
              <circle className="web-node"        cx="140"  cy="360" r="5"/>
              <circle className="web-node"        cx="260"  cy="500" r="4"/>
              <circle className="web-node anchor" cx="420"  cy="340" r="6"/>
              <circle className="web-halo"        cx="420"  cy="340" r="6"/>
              <circle className="web-node"        cx="600"  cy="440" r="5"/>
              <circle className="web-node done"   cx="820"  cy="540" r="5"/>
              <circle className="web-node"        cx="1020" cy="440" r="5"/>
              <circle className="web-node"        cx="1160" cy="500" r="3"/>
              <circle className="web-node"        cx="360"  cy="620" r="3"/>
              <circle className="web-node"        cx="540"  cy="640" r="3"/>
              <circle className="web-node"        cx="900"  cy="660" r="3"/>
              <circle className="web-node"        cx="160"  cy="90"  r="2"/>
              <circle className="web-node"        cx="940"  cy="100" r="2"/>
              <circle className="web-node"        cx="1100" cy="360" r="2"/>
              <circle className="web-node"        cx="40"   cy="540" r="2"/>
            </g>
            {/* labels */}
            <g fontFamily="var(--font-mono)">
              <text className="web-label near" x="212" y="172">invariants</text>
              <text className="web-label"      x="368" y="132">two pointers</text>
              <text className="web-label"      x="528" y="252">hashing</text>
              <text className="web-label"      x="688" y="172">recursion</text>
              <text className="web-label"      x="868" y="232">trees</text>
              <text className="web-label"      x="1046" y="172">graphs</text>
              <text className="web-label"      x="148" y="352">primitives</text>
              <text className="web-label near" x="428" y="332">load · capacity</text>
              <text className="web-label"      x="608" y="432">queues</text>
              <text className="web-label"      x="828" y="532">CAP</text>
              <text className="web-label"      x="1028" y="432">coordination</text>
            </g>
            {/* sparks */}
            <circle className="web-spark s1" r="2.2"/>
            <circle className="web-spark s2" r="2.2"/>
            <circle className="web-spark s3" r="2.2"/>
            <circle className="web-spark s4" r="2.2"/>
          </svg>
          {/* vignette — keeps type readable */}
          <div className="hero-vignette" />
        </div>

        {/* Hero text */}
        <div
          className="relative flex flex-col items-center max-w-[820px] mx-auto px-6"
          style={{ zIndex: 2 }}
        >
          <Kicker>The atlas for senior reasoning</Kicker>
          <h1
            className="font-[var(--font-display)] font-light leading-[0.96] tracking-[-0.035em] mt-5 mb-7 text-[var(--ms-text-heading)]"
            style={{ fontSize: 'clamp(56px,8vw,112px)' }}
          >
            Learn to think{' '}
            <em className="text-[var(--ms-text-muted)] italic">deeper.</em>
          </h1>
          <p className="font-[var(--font-display)] italic text-[21px] leading-[1.55] text-[var(--ms-text-muted)] max-w-[560px] mx-auto m-0 mb-9">
            A map of the fundamentals every senior engineer eventually circles
            back to &mdash; and a place to actually practice them.
          </p>
          <div className="flex gap-3 items-center flex-wrap justify-center">
            <Btn primary>
              Open the atlas{' '}
              <span className="font-[var(--font-mono)] text-[11px] px-1.5 py-0.5 rounded bg-white/20">
                ⏎
              </span>
            </Btn>
            <Btn>How this works</Btn>
          </div>
          <div
            className="grid gap-12 mt-14 font-[var(--font-mono)] text-[11px] text-[var(--ms-text-subtle)] tracking-[0.06em] text-center"
            style={{ gridTemplateColumns: 'repeat(3,auto)' }}
          >
            {[
              { val: '128', label: 'concepts mapped' },
              { val: '3', label: 'paths · DSA · SysDes · FS' },
              { val: 'Free', label: 'while we build it' },
            ].map((s) => (
              <div key={s.label}>
                <b className="block font-[var(--font-display)] italic font-normal text-[22px] text-[var(--ms-text-heading)] tracking-[0]">
                  {s.val}
                </b>
                {s.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Philosophy strip ─────────────────────────────────────────── */}
      <section className={`${sectionBase} bg-[var(--ms-bg-pane-secondary)]`}>
        <div className={W}>
          <div
            className="grid gap-14 items-start"
            style={{ gridTemplateColumns: '220px 1fr' }}
          >
            <div>
              <Kicker muted>On the point</Kicker>
              <div className="w-8 h-0.5 bg-[var(--ms-blue)] mt-3.5" />
            </div>
            <div>
              <p
                className="font-[var(--font-display)] font-light leading-[1.2] tracking-[-0.02em] m-0 text-[var(--ms-text-heading)]"
                style={{ fontSize: 'clamp(28px,3.4vw,44px)' }}
              >
                Coding is one way of expressing an idea. Most engineers top out
                because they never got{' '}
                <em className="text-[var(--ms-text-muted)] italic">
                  fluent in the other ways
                </em>{' '}
                &mdash; structures, trade-offs, the shape of systems under load.
              </p>
              <p className="mt-7 text-[15px] leading-[1.75] text-[var(--ms-text-muted)] max-w-[720px] m-0">
                The atlas above isn&rsquo;t a curriculum. It&rsquo;s the map of
                how those concepts connect &mdash; so when you land on a new
                codebase or design review, you already have coordinates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Full atlas ───────────────────────────────────────────────── */}
      <section className={sectionBase}>
        <div className={W}>
          <div className="flex justify-between items-baseline mb-4">
            <div>
              <Kicker>The territory</Kicker>
              <h2
                className="font-[var(--font-display)] font-light leading-[1.05] tracking-[-0.02em] mt-3.5 mb-2.5 text-[var(--ms-text-heading)]"
                style={{ fontSize: 'clamp(32px,4vw,52px)' }}
              >
                Every concept,{' '}
                <em className="text-[var(--ms-text-muted)] italic">
                  where it lives.
                </em>
              </h2>
              <p className="text-[var(--ms-text-muted)] max-w-[640px] m-0 text-[15px]">
                Hover a node to see prerequisites. Click to enter the lesson.
              </p>
            </div>
            <div className="flex gap-2">
              {['all', 'DSA', 'sys·des', 'fs'].map((f, i) => (
                <button
                  key={f}
                  className={`px-4 py-2 rounded-lg border font-[var(--font-mono)] text-[12px] transition-all ${i === 1 ? 'border-[var(--ms-blue)] text-[var(--ms-blue)]' : 'border-[var(--ms-surface)] text-[var(--ms-text-body)]'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div
            className="relative h-[640px] mt-6 border border-[var(--ms-surface)] rounded-2xl overflow-hidden"
            style={{
              background: `linear-gradient(var(--ms-bg-pane) 1px, transparent 1px) 0 0 / 48px 48px, linear-gradient(90deg, var(--ms-bg-pane) 1px, transparent 1px) 0 0 / 48px 48px, var(--ms-bg-pane-secondary)`,
            }}
          >
            <svg
              viewBox="0 0 1200 640"
              className="absolute inset-0 w-full h-full"
              aria-hidden
            >
              <g stroke="var(--ms-surface1)" strokeWidth="1" fill="none">
                <path d="M180,180 L360,120 L540,220 L720,180 L900,280 L1060,200" />
                <path d="M180,180 L220,380 L420,440 L600,400 L820,500 L1020,440" />
                <path d="M360,120 L420,440" />
                <path d="M540,220 L600,400" />
                <path d="M720,180 L820,500" />
                <path d="M900,280 L820,500" />
                <path d="M1060,200 L1020,440" />
                <path d="M220,380 L540,220" strokeDasharray="3 4" />
              </g>
            </svg>

            {(
              [
                { x: '180px', y: '180px', label: '01 arrays & invariants', type: 'core' },
                { x: '360px', y: '120px', label: '02 two pointers ✓', type: 'done' },
                { x: '540px', y: '220px', label: '03 hashing', type: 'normal' },
                { x: '720px', y: '180px', label: '04 recursion', type: 'normal' },
                { x: '900px', y: '280px', label: '05 binary trees', type: 'normal' },
                { x: '1060px', y: '200px', label: '06 graphs', type: 'locked' },
                { x: '220px', y: '380px', label: 'a primitives', type: 'normal' },
                { x: '420px', y: '440px', label: 'b load & capacity', type: 'core' },
                { x: '600px', y: '400px', label: 'c queues', type: 'normal' },
                { x: '820px', y: '500px', label: 'd consistency · CAP', type: 'normal' },
                { x: '1020px', y: '440px', label: 'e coordination', type: 'locked' },
              ] as const
            ).map((n) => (
              <AtlasNode key={n.label} x={n.x} y={n.y} type={n.type}>
                {n.label}
              </AtlasNode>
            ))}

            <div
              className="absolute font-[var(--font-hand)] text-[var(--ms-peach)] text-[22px] leading-[1.1]"
              style={{ left: '460px', top: '70px', transform: 'rotate(-3deg)' }}
            >
              ← where you are
            </div>
            <div className="absolute top-3.5 left-3.5 font-[var(--font-mono)] text-[10px] text-[var(--ms-text-faint)] tracking-[0.1em]">
              ATLAS v0.4 · 128 nodes · hover to preview
            </div>
          </div>
          <div className="mt-3.5 flex justify-between font-[var(--font-mono)] text-[11px] text-[var(--ms-text-faint)] tracking-[0.06em]">
            <span>DSA band · top</span>
            <span>drag to pan · scroll to zoom</span>
            <span>Sys-Des band · bottom</span>
          </div>
        </div>
      </section>

      {/* ─── Three tracks ─────────────────────────────────────────────── */}
      <section className={`${sectionBase} bg-[var(--ms-bg-pane-secondary)]`}>
        <div className={W}>
          <Kicker>The three tracks</Kicker>
          <h2
            className="font-[var(--font-display)] font-light leading-[1.1] tracking-[-0.02em] mt-3.5 mb-7 text-[var(--ms-text-heading)]"
            style={{ fontSize: 'clamp(30px,3.6vw,46px)' }}
          >
            Pick the band you&rsquo;re climbing.
          </h2>
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {[
              {
                title: '01 · DSA',
                progress: '12 / 48',
                pct: '25%',
                desc: 'Pattern recognition as reasoning. Where every "clever" trick is a structural insight.',
                items: [
                  { label: 'Arrays · invariants', s: 'done' },
                  { label: 'Two pointers', s: 'done' },
                  { label: 'Hashing & buckets', s: 'now' },
                  { label: 'Recursion', s: '' },
                  { label: 'Trees · 14 more', s: 'lock' },
                ],
                foot: 'Resume where you left off',
                footLink: 'continue →',
                dim: false,
              },
              {
                title: '02 · System Design',
                progress: '3 / 36',
                pct: '8%',
                desc: 'Systems that scale, fail gracefully, stay coherent under load. No hand-waving.',
                items: [
                  { label: 'Primitives', s: 'done' },
                  { label: 'Load & capacity', s: 'now' },
                  { label: 'Queues & back-pressure', s: '' },
                  { label: 'Consistency · CAP', s: '' },
                  { label: 'Coordination · 12 more', s: 'lock' },
                ],
                foot: "You're new here",
                footLink: 'start →',
                dim: false,
              },
              {
                title: '03 · Fullstack',
                progress: '— / —',
                pct: '0%',
                desc: 'The seams between frontend, backend, and infrastructure. Reason about the whole stack.',
                items: [
                  { label: 'Contracts & boundaries', s: 'lock' },
                  { label: 'Runtime surfaces', s: 'lock' },
                  { label: 'Release coupling', s: 'lock' },
                  { label: 'Observability', s: 'lock' },
                  { label: '+ more', s: 'lock' },
                ],
                foot: 'Drops late 2026',
                footLink: 'notify me',
                dim: true,
              },
            ].map((t) => (
              <div
                key={t.title}
                className={`border border-[var(--ms-surface)] rounded-xl p-6 bg-[var(--ms-bg-pane)] flex flex-col gap-3.5 min-h-[260px] ${t.dim ? 'opacity-55' : ''}`}
              >
                <div className="flex justify-between items-baseline">
                  <h3 className="m-0 font-[var(--font-display)] italic font-normal text-[22px] text-[var(--ms-text-heading)]">
                    {t.title}
                  </h3>
                  <span className="font-[var(--font-mono)] text-[10px] text-[var(--ms-text-faint)] tracking-[0.1em]">
                    {t.progress}
                  </span>
                </div>
                <div className="h-[3px] rounded-[3px] bg-[var(--ms-surface)] overflow-hidden my-1">
                  <span
                    className="block h-full bg-[var(--ms-blue)]"
                    style={{ width: t.pct }}
                  />
                </div>
                <p className="text-[13px] leading-[1.65] text-[var(--ms-text-muted)] m-0">
                  {t.desc}
                </p>
                <ul className="list-none m-0 p-0 font-[var(--font-mono)] text-[12px] text-[var(--ms-text-muted)] flex flex-col gap-[7px] flex-1">
                  {t.items.map((li) => (
                    <li
                      key={li.label}
                      className={`flex gap-2.5 items-center ${li.s === 'lock' ? 'text-[var(--ms-text-faint)]' : ''}`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0 mt-0.5"
                        style={{
                          background:
                            li.s === 'done'
                              ? 'var(--ms-green)'
                              : li.s === 'now'
                                ? 'var(--ms-blue)'
                                : 'var(--ms-surface)',
                          boxShadow:
                            li.s === 'now'
                              ? '0 0 0 3px color-mix(in srgb, var(--ms-blue) 22%, transparent)'
                              : 'none',
                        }}
                      />
                      {li.label}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-center mt-1.5 pt-3.5 border-t border-dashed border-[var(--ms-surface)] font-[var(--font-mono)] text-[11px] text-[var(--ms-text-subtle)]">
                  <span>{t.foot}</span>
                  <a className="text-[var(--ms-blue)] cursor-pointer">
                    {t.footLink}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Glossary strip ───────────────────────────────────────────── */}
      <section className={sectionBase}>
        <div className={W}>
          <Kicker>A taste of the vocabulary</Kicker>
          <h2
            className="font-[var(--font-display)] font-light leading-[1.12] tracking-[-0.02em] mt-3.5 mb-6 text-[var(--ms-text-heading)]"
            style={{ fontSize: 'clamp(28px,3.2vw,42px)' }}
          >
            The words seniors use,{' '}
            <em className="text-[var(--ms-text-muted)] italic">
              plainly defined.
            </em>
          </h2>
          <div
            className="grid border border-[var(--ms-surface)] rounded-xl overflow-hidden bg-[var(--ms-bg-pane)]"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))',
            }}
          >
            {GLOSSARY.map((g) => (
              <div
                key={g.term}
                className="px-5 py-[18px] border-r border-b border-[var(--ms-surface)] font-[var(--font-mono)] text-[12px] text-[var(--ms-text-subtle)] flex flex-col gap-1 cursor-default hover:bg-[var(--ms-bg-pane-secondary)] transition-colors"
              >
                <span className="text-[var(--ms-text-body)] font-medium">
                  {g.term}
                </span>
                <span className="text-[var(--ms-text-faint)] text-[10px] tracking-[0.08em] uppercase">
                  {g.type}
                </span>
                <span>{g.def}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 font-[var(--font-mono)] text-[11px] text-[var(--ms-text-faint)] tracking-[0.08em]">
            128 more &rarr; browse full glossary
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
