import { db } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const page = req.nextUrl.searchParams.get('page') || '1';
  const limit = req.nextUrl.searchParams.get('limit') || '40';

  const posts = await db.getPosts(parseInt(page), parseInt(limit));

  return NextResponse.json(posts);
};
