//src/app/api/notes/[id]/route.js
import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req, context) {
  const params = await context.params; // `params`를 동기적으로 처리
  const noteId = parseInt(params.id, 10);
  console.log("PUT");
  if (isNaN(noteId)) {
    return NextResponse.json({ error: 'Invalid note ID' }, { status: 400 });
  }

  try {
    const data = await req.json();
    const { title, content, isFavorite } = data;
    console.log(data);

    // if (!content || !content.value) {
    //   return NextResponse.json({ error: 'Content is missing or invalid' }, { status: 400 });
    // }
    console.log("here");

    
    const updateData = {};
    if (title) updateData.title = title;
    if (content && content.value) {
      updateData.content = {
        update: {
          value: content.value,
        },
      };
    }
    if (typeof isFavorite !== 'undefined') {
      if (typeof isFavorite !== 'boolean') {
        return NextResponse.json({ error: '`isFavorite` must be a boolean' }, { status: 400 });
      }
      updateData.isFavorite = isFavorite;
    }
    console.log('Updating note:', noteId, 'with data:', updateData);

    // Prisma를 통한 업데이트
    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: updateData,
      include: { content: true },
    });



    // const updatedNote = await prisma.note.update({
    //   where: {
    //     id: noteId,
    //   },
    //   data: {
    //     title: title,
    //     content: {
    //       update: {
    //         value: content.value,
    //       },
    //     },
    //     isFavorite: isFavorite,
    //   },
    //   include: {
    //     content: true,
    //   },
    // });

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
    console.log('Received data:', { title, content, userId });
    
    const newNote = await prisma.note.create({
      data: {
        title: 'New Note',
        content: {
          create: {
            value: 'Initial content',
          },
        },
        userId: parseInt(userId, 10),
      },
      include: {
        content: true,
      },
    });
    console.log("New note created:", newNote);
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
export async function DELETE(req, context) {
  const { params } = context;
  const { id } = await params; // params를 await

  const data = await req.json();
  const { userId } = data;

  console.log('Deleting note:', id, 'for user:', userId);
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
    console.log("Existing note:", existingNote);

    // 노트 삭제 (연관된 Content도 Cascade 설정에 따라 삭제됨)
    await prisma.note.delete({
      where: { id: noteId },
    });
    console.log(`Note with ID: ${noteId} deleted successfully`);
    return new Response(JSON.stringify({ message: 'Note deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting note:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete note' }), { status: 500 });
  }
}