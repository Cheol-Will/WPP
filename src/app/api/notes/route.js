import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();
    const { title, content, userId } = data;

    if (!userId) {
      console.error('User ID is required');
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const newNote = await prisma.note.create({
      data: {
        title: title || 'Untitled Note',
        content: {
          create: {
            type: content?.type || 'text',
            value: content?.value || '',
          },
        },
        userId: parseInt(userId, 10),
      },
      include: {
        content: true,
      },
    });

    return NextResponse.json(newNote);
  } catch (error) {
    console.error('Failed to create note:', error);
    return NextResponse.json({ error: 'Failed to create note', details: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const query = searchParams.get('query'); // 검색 키워드
    const whereCondition = { userId: parseInt(userId, 10) };
    
    if (!userId || isNaN(parseInt(userId, 10))) {
      console.error('Valid User ID is required');
      return NextResponse.json({ error: 'Valid User ID is required' }, { status: 400 });
    }

    if (query) {
      whereCondition.AND = [
        {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { some: { value: { contains: query, mode: 'insensitive' } } } },
          ],
        },
      ];
    }

    const notes = await prisma.note.findMany({
      where: whereCondition,
      include: {
        content: true,
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    return NextResponse.json({ error: 'Failed to fetch notes', details: error.message }, { status: 500 });
  }
}
