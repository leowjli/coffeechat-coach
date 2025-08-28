import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateChatResponse } from '@/lib/ai';
import { validateChatMessage } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { scenario, message } = validateChatMessage(body);

    // For streaming response, we need to collect previous messages from the client
    // This is a simplified version - in a real app you might store conversation state
    const messages = [
      {
        role: 'user' as const,
        content: message
      }
    ];

    const stream = await generateChatResponse(scenario, messages);

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { error: 'Please sign in to use this feature.' },
          { status: 401 }
        );
      }
      if (error.message.includes('Invalid response format')) {
        return NextResponse.json(
          { error: 'Unable to process message at the moment. Please try again.' },
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