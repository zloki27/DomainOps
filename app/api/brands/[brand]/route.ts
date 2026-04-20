import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import {
  parseDraftSubmission,
  parseSubmittedSubmission,
  SubmissionValidationError,
} from '@/lib/questionnaire-validation';
import {
  assertResponseMutable,
  SubmissionLockedError,
} from '@/lib/submission-policy';

type Params = { params: Promise<{ brand: string }> };

function toErrorResponse(error: unknown) {
  if (error instanceof SubmissionLockedError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  if (error instanceof SubmissionValidationError) {
    return NextResponse.json(
      { error: error.message, issues: error.issues },
      { status: error.status }
    );
  }

  throw error;
}

function toPrismaJsonValue(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { brand: slug } = await params;
  const brandRecord = await prisma.brand.findUnique({
    where: { slug },
    include: { response: true },
  });
  if (!brandRecord) return NextResponse.json(null, { status: 404 });
  if (!brandRecord.response) return NextResponse.json(null);

  const r = brandRecord.response;
  return NextResponse.json({
    status: r.status,
    completedBy: r.completedBy,
    questionnaireDate: r.questionnaireDate.toISOString(),
    payload: r.payload,
    submittedAt: r.submittedAt?.toISOString() ?? null,
  });
}

export async function POST(req: NextRequest, { params }: Params) {
  const { brand: slug } = await params;
  const brandRecord = await prisma.brand.findUnique({
    where: { slug },
    include: { response: true },
  });
  if (!brandRecord) return NextResponse.json({ error: 'Brand not found' }, { status: 404 });

  try {
    assertResponseMutable(brandRecord.response?.status);

    const { completedBy, questionnaireDate, payload } = parseDraftSubmission(
      await req.json()
    );

    await prisma.brandResponse.upsert({
      where: { brandId: brandRecord.id },
      update: {
        status: 'IN_PROGRESS',
        completedBy,
        questionnaireDate,
        payload: toPrismaJsonValue(payload),
      },
      create: {
        brandId: brandRecord.id,
        status: 'IN_PROGRESS',
        completedBy,
        questionnaireDate,
        payload: toPrismaJsonValue(payload),
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }

  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { brand: slug } = await params;
  const brandRecord = await prisma.brand.findUnique({
    where: { slug },
    include: { response: true },
  });
  if (!brandRecord) return NextResponse.json({ error: 'Brand not found' }, { status: 404 });

  try {
    assertResponseMutable(brandRecord.response?.status);

    const { completedBy, questionnaireDate, payload } = parseSubmittedSubmission(
      await req.json()
    );

    await prisma.brandResponse.upsert({
      where: { brandId: brandRecord.id },
      update: {
        status: 'SUBMITTED',
        completedBy,
        questionnaireDate,
        payload: toPrismaJsonValue(payload),
        submittedAt: new Date(),
      },
      create: {
        brandId: brandRecord.id,
        status: 'SUBMITTED',
        completedBy,
        questionnaireDate,
        payload: toPrismaJsonValue(payload),
        submittedAt: new Date(),
      },
    });
  } catch (error) {
    return toErrorResponse(error);
  }

  return NextResponse.json({ ok: true });
}
