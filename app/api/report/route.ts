import { NextResponse } from 'next/server';
import { getBrandsWithStatus } from '@/lib/report';

export async function GET() {
  const brands = await getBrandsWithStatus();
  return NextResponse.json(brands);
}
