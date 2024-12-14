// src/app/api/contents/[noteId]/route.js

import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(request, { params }) {
  const { noteId } = params;
  const { type, value } = await request.json();

  const newContent = await prisma.content.create({
    data: {
      type,
      value,
      noteId: parseInt(noteId),
    },
  });

  return NextResponse.json(newContent, { status: 201 });
}
