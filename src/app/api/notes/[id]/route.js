import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';
export async function PUT(req, context) {
  const { params } = context;
  const noteId = parseInt(params.id, 10);

  if (isNaN(noteId)) {
    return NextResponse.json({ error: 'Invalid note ID' }, { status: 400 });
  }

  try {
    const data = await req.json();
    const { title, content } = data;

    if (!content || !content.value) {
      return NextResponse.json({ error: 'Content is missing or invalid' }, { status: 400 });
    }

    const updatedNote = await prisma.note.update({
      where: {
        id: noteId,
      },
      data: {
        title: title,
        content: {
          update: {
            value: content.value,
          },
        },
      },
      include: {
        content: true,
      },
    });

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error('Failed to update note:', error.message, error.stack);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}
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
export async function DELETE(request, { params }) {
  const { id } = params;
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  try {
    // ID 검증
    const noteId = parseInt(id, 10);
    if (isNaN(noteId)) {
      return new Response(JSON.stringify({ error: 'Invalid note ID' }), { status: 400 });
    }

    // userId 검증
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is missing' }), { status: 400 });
    }

    // 노트 존재 여부 및 소유자 확인
    const existingNote = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!existingNote) {
      return new Response(JSON.stringify({ error: 'Note not found' }), { status: 404 });
    }

    if (existingNote.userId.toString() !== userId) {
      return new Response(JSON.stringify({ error: 'Forbidden: You do not own this note' }), { status: 403 });
    }

    // 노트 삭제 (연관된 Content도 Cascade 설정에 따라 삭제됨)
    await prisma.note.delete({
      where: { id: noteId },
    });

    return new Response(JSON.stringify({ message: 'Note deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting note:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete note' }), { status: 500 });
  }
}