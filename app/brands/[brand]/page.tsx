import { notFound } from 'next/navigation';
import { BRANDS } from '@/lib/brands';
import BrandForm from './BrandForm';

export default async function BrandPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: slug } = await params;
  const brandDef = BRANDS.find(b => b.slug === slug);
  if (!brandDef) notFound();
  return <BrandForm brand={brandDef} />;
}
