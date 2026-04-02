import { notFound } from 'next/navigation'
import Link from 'next/link'
import { loadScenario, getAllScenarioSlugsFromDisk } from '@/lib/fullstack/content'
import { getScenarioBySlug } from '@/lib/fullstack/journey'
import { extractHeadings } from '@/lib/fullstack/headings'
import TableOfContents from '@/components/ui/TableOfContents/TableOfContents'
import { PageHero } from '@/components/ui/PageHero/PageHero'
import { PageLayout } from '@/components/ui/PageLayout/PageLayout'
import MarkdownRenderer from '@/components/fullstack/MarkdownRenderer/MarkdownRenderer'
import CheckWork from '@/components/fullstack/CheckWork/CheckWork'


interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return getAllScenarioSlugsFromDisk().map((slug) => ({ slug }))
}

export default function ScenarioPage({ params }: Props) {
  const content = loadScenario(params.slug)
  if (!content) notFound()

  const match = getScenarioBySlug(params.slug)
  if (!match) notFound()

  const { scenario, section, phase } = match
  const color = 'var(--primary)'

  const strippedBrief = content.brief.replace(/^#[^#].*\n+/, '').trimStart()
  const strippedWalkthrough = content.walkthrough
    ? content.walkthrough.replace(/^#[^#].*\n+/, '').trimStart()
    : null

  const tocContent = strippedWalkthrough ?? strippedBrief
  const headings = extractHeadings(tocContent)

  const allScenarios = [...section.firstPass, ...section.reinforce]
  const idx = allScenarios.findIndex((s) => s.slug === params.slug)
  const prevScenario = idx > 0 ? allScenarios[idx - 1] : null
  const nextScenario = idx < allScenarios.length - 1 ? allScenarios[idx + 1] : null

  return (
    <>
      <PageHero>
        <p className="text-xs font-mono mb-2 text-[var(--fg-gutter)]">{section.label}</p>
        <h1 className="text-5xl font-bold leading-tight text-[var(--fg)]">{scenario.label}</h1>
      </PageHero>

      <PageLayout accentColor={color} aside={<><TableOfContents headings={headings} title="Contents" /><CheckWork slug={params.slug} /></>}>
          <section className="space-y-8">
            <div className="rounded-xl p-6 bg-[var(--bg-alt)] border border-[var(--border)]">
              <p className="text-xs font-semibold uppercase mb-4 text-[var(--fg-gutter)] font-[ui-monospace,monospace] tracking-[0.08em]">
                Your task
              </p>
              <MarkdownRenderer
                content={strippedBrief}
                prompts={content.promptContent}
                phase={phase.number}
                storageKeyPrefix={`chat:${params.slug}`}
              />
            </div>

            {strippedWalkthrough && (
              <MarkdownRenderer
                content={strippedWalkthrough}
                prompts={content.promptContent}
                phase={phase.number}
                storageKeyPrefix={`chat:${params.slug}`}
              />
            )}

            <div className="flex items-center justify-between pt-6 border-t border-t-[var(--border)]">
              {prevScenario ? (
                <Link href={`/fullstack/scenarios/${prevScenario.slug}`} className="flex items-center gap-2 text-sm hover:opacity-70 text-[var(--fg-comment)]">
                  ← {prevScenario.label}
                </Link>
              ) : (
                <Link href="/fullstack/path" className="flex items-center gap-2 text-sm hover:opacity-70 text-[var(--fg-comment)]">
                  ← The Path
                </Link>
              )}
              {nextScenario ? (
                <Link href={`/fullstack/scenarios/${nextScenario.slug}`} className="flex items-center gap-2 text-sm hover:opacity-70 text-[var(--fg-comment)]">
                  {nextScenario.label} →
                </Link>
              ) : (
                <div />
              )}
            </div>
          </section>
      </PageLayout>
    </>
  )
}
