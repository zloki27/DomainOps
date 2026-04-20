import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

type Params = { params: Promise<{ brand: string }> };

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { brand: slug } = await params;

  const brandRecord = await prisma.brand.findUnique({ where: { slug } });
  if (!brandRecord) return NextResponse.json({ error: 'Brand not found' }, { status: 404 });

  await prisma.brandResponse.deleteMany({ where: { brandId: brandRecord.id } });

  return NextResponse.json({ ok: true });
}
