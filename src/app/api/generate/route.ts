import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateCoffeeChatKit } from '@/lib/ai';
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
    const { userInfo, targetInfo } = body;

    if (!userInfo || !targetInfo) {
      return NextResponse.json(
        { error: 'Both user information and target information are required' },
        { status: 400 }
      );
    }

    if (!userInfo.name || !userInfo.role || !targetInfo.profileText) {
      return NextResponse.json(
        { error: 'Name, role, and target profile text are required' },
        { status: 400 }
      );
    }

    // Generate kit using AI
    const kit = await generateCoffeeChatKit(userInfo, targetInfo);

    // Save to database
    // First create the contact
    const contact = await db.contact.create({
      data: {
        ownerClerkUserId: userId,
        name: null, // Could be extracted from profile text in the future
        profileUrl: targetInfo.profileUrl || null,
        rawProfileText: targetInfo.profileText,
      },
    });

    // Then create the kit
    const savedKit = await db.coffeechatKit.create({
      data: {
        ownerClerkUserId: userId,
        contactId: contact.id,
        sharedInterests: kit.sharedInterests,
        starters: kit.starters,
        followUps: kit.followUps,
        oneLinePitch: kit.oneLinePitch,
        modelVersion: 'gpt-4o-mini',
        tokensUsed: null, // Could track this in the future
      },
    });

    return NextResponse.json({ kit, id: savedKit.id });

  } catch (error) {
    console.error('Generate API error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Too many requests. Please wait a moment and try again.' },
          { status: 429 }
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
          { error: 'Unable to generate kit at the moment. Please try again.' },
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