'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate, truncateText } from '@/lib/utils';

interface ChatSession {
  id: string;
  scenario: string;
  transcript: Array<{ role: string; content: string }>;
  feedback: { strengths: string[]; improvements: string[] };
  createdAt: string;
}

interface EmailDraft {
  id: string;
  draftText: string;
  aiFeedback: { strengths: string[]; improvements: string[] };
  aiRewrite: string;
  aiSubjectSuggestions: string[];
  createdAt: string;
}

interface HistoryData {
  chatSessions: ChatSession[];
  kits: Array<{
    id: string;
    contact: {
      name: string | null;
      profileUrl: string | null;
    };
    sharedInterests: string[];
    starters: string[];
    followUps: string[];
    oneLinePitch: string;
    createdAt: string;
  }>;
  emailDrafts: EmailDraft[];
}

export default function HistoryPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [data, setData] = useState<HistoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'chats' | 'kits' | 'emails'>('chats');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/');
      return;
    }

    fetchHistory();
  }, [isSignedIn, router]);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/history');
      if (!response.ok) throw new Error('Failed to fetch history');
      
      const historyData = await response.json();
      setData(historyData);
    } catch (error) {
      console.error('Error fetching history:', error);
      
      // Provide user-friendly error messages
      if (error instanceof Error) {
        if (error.message.includes('Please sign in')) {
          setError('Please sign in to view your history.');
        } else if (error.message.includes('Unable to load history')) {
          setError('Unable to load history at the moment. Please try again.');
        } else {
          setError('Something went wrong. Please try again.');
        }
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  if (!isSignedIn) return null;

  return (
    <div className="min-h-screen bg-[color:var(--bg-base)]">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-h1 text-[color:var(--text-primary)] mb-8">Your History</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-[color:var(--text-secondary)]">Loading...</div>
          </div>
        ) : (
          <main>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[color:var(--text-base)] mb-4 font-urbanist">
                Your Practice History
              </h1>
              <p className="text-lg text-[color:var(--text-muted)]">
                Review your past sessions, kits, and email drafts
              </p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-8">
              <div className="flex space-x-1 bg-[color:var(--bg-surface)] rounded-lg p-1 shadow-sm border border-[color:var(--border-default)]">
                <button
                  onClick={() => setActiveTab('chats')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'chats'
                      ? 'bg-[color:var(--brand-primary)] text-[color:var(--text-on-primary)]'
                      : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-base)]'
                  }`}
                >
                  Chat Sessions ({data?.chatSessions.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('kits')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'kits'
                      ? 'bg-[color:var(--brand-primary)] text-[color:var(--text-on-primary)]'
                      : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-base)]'
                  }`}
                >
                  CoffeeChat Kits ({data?.kits.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('emails')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'emails'
                      ? 'bg-[color:var(--brand-primary)] text-[color:var(--text-on-primary)]'
                      : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-base)]'
                  }`}
                >
                  Email Drafts ({data?.emailDrafts.length || 0})
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {activeTab === 'chats' && (
                <>
                  {data?.chatSessions.length === 0 ? (
                    <Card className="bg-[color:var(--bg-surface)] border-[color:var(--border-default)]">
                      <CardContent className="text-center py-12">
                        <p className="text-[color:var(--text-muted)] mb-4">No chat sessions yet</p>
                        <Button onClick={() => router.push('/scenarios')}>
                          Start Your First Practice Session
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    data?.chatSessions.map((session) => (
                      <Card key={session.id} className="bg-[color:var(--bg-surface)] border-[color:var(--border-default)]">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="capitalize text-[color:var(--text-base)]">
                                {session.scenario} Chat Session
                              </CardTitle>
                              <CardDescription className="text-[color:var(--text-muted)]">
                                {formatDate(new Date(session.createdAt))}
                              </CardDescription>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleExpanded(session.id)}
                              className="border-[color:var(--border-default)] text-[color:var(--text-base)] hover:bg-[color:var(--bg-surface-elevated)]"
                            >
                              {expandedItems.has(session.id) ? 'Collapse' : 'Expand'}
                            </Button>
                          </div>
                        </CardHeader>
                        {expandedItems.has(session.id) && (
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium text-green-700 mb-2">Strengths:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                  {session.feedback.strengths?.map((strength: string, index: number) => (
                                    <li key={index} className="text-sm text-[color:var(--text-base)]">{strength}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium text-[color:var(--brand-primary)] mb-2">Improvements:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                  {session.feedback.improvements?.map((improvement: string, index: number) => (
                                    <li key={index} className="text-sm text-[color:var(--text-base)]">{improvement}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))
                  )}
                </>
              )}

              {activeTab === 'kits' && (
                <>
                  {data?.kits.length === 0 ? (
                    <Card className="bg-[color:var(--bg-surface)] border-[color:var(--border-default)]">
                      <CardContent className="text-center py-12">
                        <p className="text-[color:var(--text-muted)] mb-4">No CoffeeChat kits generated yet</p>
                        <Button onClick={() => router.push('/generate')}>
                          Generate Your First Kit
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    data?.kits.map((kit) => (
                      <Card key={kit.id} className="bg-[color:var(--bg-surface)] border-[color:var(--border-default)]">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-[color:var(--text-base)]">
                                {kit.contact.name || 'CoffeeChat Kit'}
                              </CardTitle>
                              <CardDescription className="text-[color:var(--text-muted)]">
                                {formatDate(new Date(kit.createdAt))}
                              </CardDescription>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleExpanded(kit.id)}
                              className="border-[color:var(--border-default)] text-[color:var(--text-base)] hover:bg-[color:var(--bg-surface-elevated)]"
                            >
                              {expandedItems.has(kit.id) ? 'Collapse' : 'Expand'}
                            </Button>
                          </div>
                        </CardHeader>
                        {expandedItems.has(kit.id) && (
                          <CardContent>
                            <div className="grid md:grid-cols-2 gap-16">
                              <div>
                                <h4 className="font-medium mb-2 text-[color:var(--brand-primary)]">Conversation Starters:</h4>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                  {kit.starters.map((starter, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <span className="text-[color:var(--brand-primary)] font-bold">•</span>
                                      <span>{starter}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2 text-[color:var(--brand-primary)]">Shared Interests:</h4>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                  {kit.sharedInterests.map((interest, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <span className="text-[color:var(--brand-primary)] font-bold">•</span>
                                      <span>{interest}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div className="mt-4">
                              <h4 className="font-medium mb-2 text-[color:var(--brand-primary)]">One-Line Pitch:</h4>
                              <p className="text-sm bg-[color:var(--bg-surface-elevated)] p-2 rounded">{kit.oneLinePitch}</p>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))
                  )}
                </>
              )}

              {activeTab === 'emails' && (
                <>
                  {data?.emailDrafts.length === 0 ? (
                    <Card className="bg-[color:var(--bg-surface)] border-[color:var(--border-default)]">
                      <CardContent className="text-center py-12">
                        <p className="text-[color:var(--text-muted)] mb-4">No email drafts analyzed yet</p>
                        <Button onClick={() => router.push('/cold-email')}>
                          Analyze Your First Email
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    data?.emailDrafts.map((draft) => (
                      <Card key={draft.id} className="bg-[color:var(--bg-surface)] border-[color:var(--border-default)]">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-[color:var(--text-base)]">
                                Cold Email Draft
                              </CardTitle>
                              <CardDescription className="text-[color:var(--text-muted)]">
                                {formatDate(new Date(draft.createdAt))} • {truncateText(draft.draftText, 100)}
                              </CardDescription>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleExpanded(draft.id)}
                              className="border-[color:var(--border-default)] text-[color:var(--text-base)] hover:bg-[color:var(--bg-surface-elevated)]"
                            >
                              {expandedItems.has(draft.id) ? 'Collapse' : 'Expand'}
                            </Button>
                          </div>
                        </CardHeader>
                        {expandedItems.has(draft.id) && (
                          <CardContent>
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h4 className="font-medium text-[color:var(--brand-primary)] mb-2">Strengths:</h4>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                  {draft.aiFeedback.strengths?.map((strength: string, index: number) => (
                                    <li key={index} className="text-[color:var(--text-base)]">{strength}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium text-[color:var(--brand-primary)] mb-2">Improvements:</h4>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                  {draft.aiFeedback.improvements?.map((improvement: string, index: number) => (
                                    <li key={index} className="text-[color:var(--text-base)]">{improvement}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2 text-[color:var(--text-base)]">AI Rewrite:</h4>
                              <div className="bg-[color:var(--bg-surface-elevated)] p-3 rounded text-sm">
                                <pre className="whitespace-pre-wrap text-[color:var(--text-base)]">{draft.aiRewrite}</pre>
                              </div>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))
                  )}
                </>
              )}
            </div>
          </main>
        )}
      </div>
    </div>
  );
}