import Link from 'next/link';
import { PageHero } from '@/components/ui/PageHero/PageHero';
import { PageLayout } from '@/components/ui/PageLayout/PageLayout';

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return [];
}

export default function FrontendProblemPage({ params }: Props) {
  return (
    <>
      <PageHero>
        <h1 className="font-display text-5xl leading-tight text-[var(--ms-text-body)]">
          Frontend Exercises
        </h1>
        <p className="text-lg italic leading-snug text-[var(--ms-blue)]">
          Standalone frontend problem pages are not wired yet.
        </p>
      </PageHero>

      <PageLayout aside={null}>
        <section className="max-w-[720px] space-y-6">
          <p className="m-0 text-base leading-[1.75] text-[var(--ms-text-subtle)]">
            The requested exercise id was <code>{params.id}</code>. For Part 1,
            the frontend track stores its runnable exercises inside each
            fundamentals guide rather than in a separate problems directory.
          </p>
          <p className="m-0 text-base leading-[1.75] text-[var(--ms-text-subtle)]">
            Use the frontend path to open a section guide once content lands.
          </p>
          <div>
            <Link
              href="/frontend/path"
              className="text-sm text-[var(--ms-blue)] no-underline transition-opacity hover:opacity-80"
            >
              Go to Frontend Path →
            </Link>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
