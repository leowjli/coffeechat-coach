import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { analyzeColdEmail } from '@/lib/ai';
import { validateColdEmail } from '@/lib/validation';
import { checkRateLimit } from '@/lib/ratelimit';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check rate limit
    const rateLimitOk = await checkRateLimit(userId);
    if (!rateLimitOk) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { draftText } = validateColdEmail(body);

    // Analyze email using AI
    const analysis = await analyzeColdEmail(draftText);

    // Save to database
    const savedDraft = await db.coldEmailDraft.create({
      data: {
        ownerClerkUserId: userId,
        user_id: userId, // For RLS
        draftText,
        aiFeedback: {
          strengths: analysis.aiFeedback.strengths,
          improvements: analysis.aiFeedback.improvements
        },
        aiRewrite: analysis.aiRewrite,
        aiSubjectSuggestions: analysis.aiSubjectSuggestions,
      },
    });

    return NextResponse.json({
      ...analysis,
      id: savedDraft.id,
    });

  } catch (error) {
    console.error('Cold email API error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Email draft must be at least')) {
        return NextResponse.json(
          { error: 'Please provide a longer email draft (at least 20 characters).' },
          { status: 400 }
        );
      }
      if (error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { error: 'Please sign in to use this feature.' },
          { status: 401 }
        );
      }
      if (error.message.includes('Invalid response format')) {
        return NextResponse.json(
          { error: 'Unable to analyze email at the moment. Please try again.' },
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