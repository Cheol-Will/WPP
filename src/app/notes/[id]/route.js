// /src/app/api/notes/[id]/route.js

import { prisma } from '../../../../lib/prisma';

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    // 노트 ID가 유효한지 확인
    const noteId = parseInt(id, 10);
    if (isNaN(noteId)) {
      return new Response(JSON.stringify({ error: 'Invalid note ID' }), { status: 400 });
    }

    // 노트가 존재하는지 확인
    const existingNote = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!existingNote) {
      return new Response(JSON.stringify({ error: 'Note not found' }), { status: 404 });
    }

    // 노트 삭제 (연관된 Content도 Cascade 설정에 의해 삭제됩니다)
    await prisma.note.delete({
      where: { id: noteId },
    });

    return new Response(JSON.stringify({ message: 'Note deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting note:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete note' }), { status: 500 });
  }
}
