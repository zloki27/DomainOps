import { prisma } from './db';
import { BRANDS } from './brands';
import type { ReportBrandRow, QuestionnairePayload, BrandStatus } from './types';

export async function getBrandsWithStatus(): Promise<ReportBrandRow[]> {
  const responses = await prisma.brandResponse.findMany({
    select: {
      brandId: true,
      status: true,
      completedBy: true,
      updatedAt: true,
      submittedAt: true,
      payload: true,
      brand: { select: { slug: true } },
    },
  });

  const bySlug = new Map(responses.map((r) => [r.brand.slug, r]));

  return BRANDS.map((b): ReportBrandRow => {
    const r = bySlug.get(b.slug);
    if (!r) {
      return {
        slug: b.slug,
        displayName: b.displayName,
        logoPath: b.logoPath,
        status: 'Not started',
        completedBy: null,
        updatedAt: null,
        submittedAt: null,
        payload: null,
      };
    }

    const status: BrandStatus = r.status === 'SUBMITTED' ? 'Submitted' : 'In progress';
    return {
      slug: b.slug,
      displayName: b.displayName,
      logoPath: b.logoPath,
      status,
      completedBy: r.completedBy,
      updatedAt: r.updatedAt,
      submittedAt: r.submittedAt,
      payload: r.payload as QuestionnairePayload,
    };
  });
}

export async function getBrandWithStatus(slug: string): Promise<ReportBrandRow | null> {
  const brandDef = BRANDS.find((b) => b.slug === slug);
  if (!brandDef) return null;

  const brandRecord = await prisma.brand.findUnique({
    where: { slug },
    include: { response: true },
  });
  if (!brandRecord) return null;

  const r = brandRecord.response;
  if (!r) {
    return {
      slug: brandDef.slug,
      displayName: brandDef.displayName,
      logoPath: brandDef.logoPath,
      status: 'Not started',
      completedBy: null,
      updatedAt: null,
      submittedAt: null,
      payload: null,
    };
  }

  const status: BrandStatus = r.status === 'SUBMITTED' ? 'Submitted' : 'In progress';
  return {
    slug: brandDef.slug,
    displayName: brandDef.displayName,
    logoPath: brandDef.logoPath,
    status,
    completedBy: r.completedBy,
    updatedAt: r.updatedAt,
    submittedAt: r.submittedAt,
    payload: r.payload as QuestionnairePayload,
  };
}
