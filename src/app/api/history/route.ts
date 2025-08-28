import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user's history from database
    const [chatSessions, kits, emailDrafts] = await Promise.all([
      // Chat sessions
      db.chatSession.findMany({
        where: { ownerClerkUserId: userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      
      // CoffeeChat kits
      db.coffeechatKit.findMany({
        where: { ownerClerkUserId: userId },
        include: {
          contact: {
            select: {
              name: true,
              profileUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      
      // Email drafts
      db.coldEmailDraft.findMany({
        where: { ownerClerkUserId: userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
    ]);

    return NextResponse.json({
      chatSessions,
      kits,
      emailDrafts,
    });

  } catch (error) {
    console.error('History API error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { error: 'Please sign in to view your history.' },
          { status: 401 }
        );
      }
      if (error.message.includes('database') || error.message.includes('DATABASE_URL')) {
        return NextResponse.json(
          { error: 'Unable to load history at the moment. Please try again.' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}