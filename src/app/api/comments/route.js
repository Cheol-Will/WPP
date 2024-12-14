import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

// 댓글 조회
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const noteId = parseInt(searchParams.get('noteId'), 10);

  if (!noteId || isNaN(noteId)) {
    return NextResponse.json({ error: 'Invalid note ID' }, { status: 400 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { noteId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// 댓글 추가
export async function POST(req) {
  try {
    const data = await req.json();
    const { content, noteId } = data;

    if (!content || !noteId) {
      return NextResponse.json({ error: 'Content and Note ID are required' }, { status: 400 });
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        noteId: parseInt(noteId, 10),
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Failed to create comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

// 댓글 삭제
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const commentId = parseInt(searchParams.get('commentId'), 10);

    if (!commentId || isNaN(commentId)) {
      return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 });
    }

    await prisma.comment.delete({ where: { id: commentId } });
    return NextResponse.json({ message: 'Comment deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
