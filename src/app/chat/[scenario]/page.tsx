'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Navbar } from '@/components/Navbar';
import { ChatMessage } from '@/components/ChatMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getScenario } from '@/lib/scenarios';
import type { ChatMessage as ChatMessageType, ChatFeedback } from '@/lib/ai';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<ChatFeedback | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const scenario = getScenario(params.scenario as string);

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/');
      return;
    }
    
    if (!scenario) {
      router.push('/scenarios');
      return;
    }

    // Initial AI greeting
    const initialMessage: ChatMessageType = {
      role: 'assistant',
      content: `Hi! I'm excited to chat with you today. I'm ${scenario.persona}. Thanks for reaching out - I'd love to learn more about your background and see how I can help. How are you doing?`
    };
    setMessages([initialMessage]);

    // Focus the input field when component loads
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [scenario, isSignedIn, router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Keep input focused after messages update
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [messages, isLoading]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessageType = {
      role: 'user',
      content: input.trim()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario: params.scenario,
          message: input.trim(),
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const aiMessage: ChatMessageType = {
        role: 'assistant',
        content: ''
      };

      setMessages(prev => [...prev, aiMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        aiMessage.content += chunk;
        
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...aiMessage };
          return updated;
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      // Add user message back if AI response failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, params.scenario]);

  const endSession = async () => {
    if (messages.length < 4) {
      alert('Please have a longer conversation before ending the session.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript: messages }),
      });

      if (!response.ok) throw new Error('Failed to get feedback');

      const feedbackData = await response.json();
      setFeedback(feedbackData);
      setShowFeedback(true);

    } catch (error) {
      console.error('Error getting feedback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!scenario) return null;

  if (showFeedback && feedback) {
    return (
      <div className="min-h-screen bg-[color:var(--bg-base)]">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-12">
          <div className="bg-[color:var(--bg-surface)] rounded-lg shadow-[var(--shadow-sm)] border border-[color:var(--border-default)] p-4 sm:p-8">
            <h1 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 text-[color:var(--text-base)] font-urbanist">
              Session Complete! 🎉
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[color:var(--brand-primary)] mb-3 sm:mb-4 font-urbanist">
                  Strengths
                </h2>
                <ul className="space-y-2">
                  {feedback.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-[color:var(--brand-primary)] flex-shrink-0">•</span>
                      <span className="text-[color:var(--text-muted)] text-sm sm:text-base">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[color:var(--brand-primary)] mb-3 sm:mb-4 font-urbanist">
                  💡 Areas for Improvement
                </h2>
                <ul className="space-y-2">
                  {feedback.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-[color:var(--brand-primary)] flex-shrink-0">•</span>
                      <span className="text-[color:var(--text-muted)] text-sm sm:text-base">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Button onClick={() => router.push('/scenarios')} className="w-full sm:w-auto">
                Try Another Scenario
              </Button>
              <Button variant="outline" onClick={() => router.push('/history')} className="w-full sm:w-auto">
                View History
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--bg-base)] flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col w-full">
        {/* Header */}
        <div className="bg-[color:var(--bg-surface)] border-b border-[color:var(--border-default)] p-3 sm:p-4 flex-shrink-0">
          <div className="text-center">
            <h1 className="text-lg sm:text-xl font-semibold text-[color:var(--text-base)] font-urbanist leading-tight">{scenario.title}</h1>
            <p className="text-xs sm:text-sm text-[color:var(--text-muted)] mt-1">{scenario.persona}</p>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto bg-[color:var(--bg-surface)] px-2 sm:px-4">
          <div className="py-2">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message}
                persona={message.role === 'assistant' ? scenario.persona : undefined}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-[color:var(--bg-surface)] border-t border-[color:var(--border-default)] p-3 sm:p-4 flex-shrink-0">
          <div className="flex gap-2 mb-3">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              disabled={isLoading}
              className="flex-1 text-sm sm:text-base rounded-sm"
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !input.trim()}
              className="px-4 rounded-sm h-10"
            >
              Send
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
            <p className="text-xs text-[color:var(--text-muted)] order-2 sm:order-1">
              Have at least 4 messages before ending
            </p>
            <Button 
              variant="outline" 
              onClick={endSession}
              disabled={isLoading || messages.length < 4}
              size="sm"
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              End Session & Get Feedback
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}