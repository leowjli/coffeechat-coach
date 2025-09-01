import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateChatFeedback } from '@/lib/ai';
import { db } from '@/lib/db';
import { z } from 'zod';

const feedbackSchema = z.object({
  sessionId: z.string().optional(),
  scenario: z.string(),
  transcript: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string(),
  })).min(2, 'Transcript must have at least 2 messages'),
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, scenario, transcript } = feedbackSchema.parse(body);

    // Generate feedback from AI
    const feedback = await generateChatFeedback(transcript);

    const feedbackData = {
      strengths: feedback.strengths,
      improvements: feedback.improvements
    };

    if (sessionId) {
      // Update existing session with feedback
      await db.chatSession.update({
        where: {
          id: sessionId,
          ownerClerkUserId: userId, // Ensure user owns the session
        },
        data: {
          feedback: feedbackData,
          transcript, // Update transcript too in case there were changes
          scenario,
        },
      });
    } else {
      // Create new session (fallback for older sessions)
      await db.chatSession.create({
        data: {
          ownerClerkUserId: userId,
          user_id: userId,
          scenario,
          transcript,
          feedback: feedbackData,
        },
      });
    }

    return NextResponse.json(feedback);

  } catch (error) {
    console.error('Feedback API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { error: 'Please sign in to use this feature.' },
          { status: 401 }
        );
      }
      if (error.message.includes('Record to update not found')) {
        return NextResponse.json(
          { error: 'Session not found or access denied.' },
          { status: 404 }
        );
      }
      if (error.message.includes('Invalid response format')) {
        return NextResponse.json(
          { error: 'Unable to generate feedback at the moment. Please try again.' },
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