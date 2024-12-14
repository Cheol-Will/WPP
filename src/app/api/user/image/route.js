// src/app/api/user/image/route.js
import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(req) {
  try {
    const { userId, imageName } = await req.json();

    if (!userId || !imageName) {
      return NextResponse.json({ error: 'User ID and image name are required' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId, 10) },
      data: { image: imageName },
    });

    return NextResponse.json({ message: 'Profile image updated successfully', image: updatedUser.image });
  } catch (error) {
    console.error('Error updating profile image:', error);
    return NextResponse.json({ error: 'Failed to update profile image', details: error.message }, { status: 500 });
  }
}