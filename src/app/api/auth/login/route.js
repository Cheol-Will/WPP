import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    return NextResponse.json({ message: 'Login successful', user: user }, { status: 200 });
  } catch (error) {
    console.error('Failed to login user:', error);
    return NextResponse.json({ error: 'Failed to login user' }, { status: 500 });
  }
}
