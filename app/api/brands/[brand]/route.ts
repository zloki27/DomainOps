import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { emptyPayload } from '@/lib/payload';
import type { QuestionnairePayload } from '@/lib/types';

type Params = { params: Promise<{ brand: string }> };

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
  const body = await req.json();
  const { completedBy, questionnaireDate, payload } = body as {
    completedBy: string;
    questionnaireDate: string;
    payload: QuestionnairePayload;
  };

  const brandRecord = await prisma.brand.findUnique({ where: { slug } });
  if (!brandRecord) return NextResponse.json({ error: 'Brand not found' }, { status: 404 });

  await prisma.brandResponse.upsert({
    where: { brandId: brandRecord.id },
    update: {
      status: 'IN_PROGRESS',
      completedBy: completedBy ?? '',
      questionnaireDate: questionnaireDate ? new Date(questionnaireDate) : new Date(),
      payload: payload ?? emptyPayload(),
    },
    create: {
      brandId: brandRecord.id,
      status: 'IN_PROGRESS',
      completedBy: completedBy ?? '',
      questionnaireDate: questionnaireDate ? new Date(questionnaireDate) : new Date(),
      payload: payload ?? emptyPayload(),
    },
  });

  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { brand: slug } = await params;
  const body = await req.json();
  const { completedBy, questionnaireDate, payload } = body as {
    completedBy: string;
    questionnaireDate: string;
    payload: QuestionnairePayload;
  };

  const brandRecord = await prisma.brand.findUnique({ where: { slug } });
  if (!brandRecord) return NextResponse.json({ error: 'Brand not found' }, { status: 404 });

  await prisma.brandResponse.upsert({
    where: { brandId: brandRecord.id },
    update: {
      status: 'SUBMITTED',
      completedBy: completedBy ?? '',
      questionnaireDate: questionnaireDate ? new Date(questionnaireDate) : new Date(),
      payload: payload ?? emptyPayload(),
      submittedAt: new Date(),
    },
    create: {
      brandId: brandRecord.id,
      status: 'SUBMITTED',
      completedBy: completedBy ?? '',
      questionnaireDate: questionnaireDate ? new Date(questionnaireDate) : new Date(),
      payload: payload ?? emptyPayload(),
      submittedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
