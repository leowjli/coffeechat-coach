import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const chatSessionSchema = z.object({
  sessionId: z.string().optional(),
  scenario: z.string(),
  transcript: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string(),
  })),
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, scenario, transcript } = chatSessionSchema.parse(body);

    let chatSession;

    if (sessionId) {
      // Update existing session
      chatSession = await db.chatSession.update({
        where: {
          id: sessionId,
          ownerClerkUserId: userId, // Ensure user owns the session
        },
        data: {
          transcript,
          scenario,
        },
      });
    } else {
      // Create new session
      chatSession = await db.chatSession.create({
        data: {
          ownerClerkUserId: userId,
          user_id: userId,
          scenario,
          transcript,
          feedback: {}, // Empty feedback object initially
        },
      });
    }

    return NextResponse.json({ 
      sessionId: chatSession.id,
      success: true 
    });

  } catch (error) {
    console.error('Chat session API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { error: 'Please sign in to save your chat.' },
          { status: 401 }
        );
      }
      if (error.message.includes('Record to update not found')) {
        return NextResponse.json(
          { error: 'Session not found or access denied.' },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to save chat session.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const chatSession = await db.chatSession.findFirst({
      where: {
        id: sessionId,
        ownerClerkUserId: userId,
      },
    });

    if (!chatSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json({
      sessionId: chatSession.id,
      scenario: chatSession.scenario,
      transcript: chatSession.transcript,
      feedback: chatSession.feedback,
      createdAt: chatSession.createdAt,
    });

  } catch (error) {
    console.error('Get chat session API error:', error);
    
    return NextResponse.json(
      { error: 'Failed to load chat session.' },
      { status: 500 }
    );
  }
}