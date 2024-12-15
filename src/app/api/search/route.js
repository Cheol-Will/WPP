import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = parseInt(searchParams.get('userId'), 10);
  const keyword = searchParams.get('keyword');

  if (!userId || isNaN(userId)) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  if (!keyword) {
    return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
  }

  try {
    const notes = await prisma.note.findMany({
      where: {
        userId, // 특정 사용자만 검색
        OR: [
            { 
                title: { 
                    contains: keyword,
                } 
            },
            {
                content: {
                    is: { 
                        value: { 
                            contains: keyword, 
                        } 
                    },
                },
            },
        ],
      },
      include: { content: true },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching search results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch search results', details: error.message },
      { status: 500 }
    );
  }
}
