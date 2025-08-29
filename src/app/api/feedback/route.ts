import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateChatFeedback } from '@/lib/ai';
import { validateFeedbackRequest } from '@/lib/validation';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { transcript } = validateFeedbackRequest(body);

    // Generate feedback from AI
    const feedback = await generateChatFeedback(transcript);

    // Save to database
    await db.chatSession.create({
      data: {
        ownerClerkUserId: userId,
        user_id: userId, // For RLS
        scenario: body.scenario,
        transcript: body.transcript,
        feedback: {
          strengths: feedback.strengths,
          improvements: feedback.improvements
        },
      },
    });

    return NextResponse.json(feedback);

  } catch (error) {
    console.error('Feedback API error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { error: 'Please sign in to use this feature.' },
          { status: 401 }
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