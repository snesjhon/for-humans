import { notFound, redirect } from 'next/navigation';
import { getBuildingContent } from '@/lib/frontend/building';

interface Props {
  params: { slug: string };
}

export default function FrontendScenarioCompatibilityPage({ params }: Props) {
  const building = getBuildingContent(params.slug);

  if (building) {
    redirect(`/frontend/building/${params.slug}`);
  }

  notFound();
}
