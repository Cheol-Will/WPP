// src/app/api/music/upload/route.js
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const userId = formData.get('userId'); // 사용자 ID를 폼 데이터에서 받습니다.

    if (!file || !userId) {
      return NextResponse.json({ error: 'User ID and file are required' }, { status: 400 });
    }

    // 파일 유효성 검사 (예: MIME 타입, 파일 크기 등)
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size exceeds limit (10MB)' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'music');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // 파일명 생성 (UUID를 사용하는 것이 더 안전하지만, 간단히 Date.now() 사용)
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadsDir, fileName);

    await fs.promises.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

    // 데이터베이스에 음악 정보 저장
    const music = await prisma.music.create({
      data: {
        fileName,
        userId: parseInt(userId, 10),
      },
    });

    return NextResponse.json({ message: 'Music uploaded successfully', music });
  } catch (error) {
    console.error('Music upload error:', error);
    return NextResponse.json({ error: 'Music upload failed', details: error.message }, { status: 500 });
  }
}
