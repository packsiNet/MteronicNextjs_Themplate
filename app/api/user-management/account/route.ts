import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import authOptions from '@/app/api/auth/[...nextauth]/auth-options';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const authDisabled = process.env.AUTH_DISABLED === 'true';

    if (!session && !authDisabled) {
      return NextResponse.json(
        { message: 'Unauthorized request' },
        { status: 401 }, // Unauthorized
      );
    }

    // Fetch the user based on the session, or fallback when auth is disabled
    const user = session
      ? await prisma.user.findUnique({
          where: { email: session.user.email },
          include: { role: true },
        })
      : await prisma.user.findFirst({
          include: { role: true },
        });

    // Check if record exists
    if (!user) {
      return NextResponse.json(
        { message: 'Record not found. Someone might have deleted it already.' },
        { status: 404 },
      );
    }

    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { message: 'Oops! Something went wrong. Please try again in a moment.' },
      { status: 500 },
    );
  }
}
