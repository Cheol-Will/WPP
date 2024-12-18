// src/app/api/music/route.js
import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const musics = await prisma.music.findMany({
      where: { userId: parseInt(userId, 10) },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ musics });
  } catch (error) {
    console.error('Error fetching musics:', error);
    return NextResponse.json({ error: 'Failed to fetch musics', details: error.message }, { status: 500 });
  }
}
