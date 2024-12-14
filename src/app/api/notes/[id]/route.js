import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req, context) {
  try {
    const { params } = context;
    const id = parseInt(params.id, 10);

    if (!id || isNaN(id)) {
      console.error('Invalid or missing ID:', params.id);
      return NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
    }

    const note = await prisma.note.findUnique({
      where: { id },
      include: { content: true },
    });

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error('Failed to fetch note:', error);
    return NextResponse.json({ error: 'Failed to fetch note', details: error.message }, { status: 500 });
  }
}