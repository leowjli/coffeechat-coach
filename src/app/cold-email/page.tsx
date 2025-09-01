'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { ColdEmailAnalysis } from '@/lib/ai';

export default function ColdEmailPage() {
  const [draftText, setDraftText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ColdEmailAnalysis | null>(null);
  const [error, setError] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000); // Clear after 2 seconds
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };


  const analyzeEmail = async () => {
    if (!draftText.trim()) {
      setError('Please enter your email draft');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/cold-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          draftText: draftText.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze email');
      }

      const data = await response.json();
      setAnalysis(data);

    } catch (error) {
      console.error('Error analyzing email:', error);

      if (error instanceof Error) {
        if (error.message.includes('longer email draft')) {
          setError('Please provide a longer email draft (at least 20 characters).');
        } else if (error.message.includes('Please sign in')) {
          setError('Please sign in to use this feature.');
        } else if (error.message.includes('Unable to analyze email')) {
          setError('Unable to analyze email at the moment. Please try again.');
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

  return (
    <div className="min-h-screen bg-[color:var(--bg-base)]">
      <Navbar />

      {/* Header Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="w-full max-w-lg">
            <h1 className="mb-2 text-6xl font-bold md:mb-2 md:text-9xl lg:text-10xl text-[color:var(--text-base)] leading-[1.2] font-urbanist">
              <span className="text-[color:var(--brand-primary)]">Master</span> Your Emails
            </h1>
            <p className="text-lg text-[color:var(--text-muted)]">
              Welcome to Email Coach, your AI-powered partner for crafting impactful cold emails and messages.
            </p>
          </div>
        </div>
      </section>

      <main className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28 bg-[color:var(--bg-surface)]">
        <div className="mx-auto max-w-7xl">

          {!analysis ? (
            <div className="bg-[color:var(--bg-base)] border-2 rounded-lg p-8 max-w-4xl mx-auto">
              <div className="mb-8 text-center">
                <h2 className="mb-5 text-4xl font-bold md:mb-6 md:text-5xl lg:text-6xl text-[color:var(--text-base)] font-urbanist">
                  Email Draft Input
                </h2>
                <p className="md:text-md text-[color:var(--text-muted)]">
                  Paste your cold email or LinkedIn message draft below
                </p>
              </div>

              <div className="space-y-6">
                <Textarea
                  placeholder={`Subject: [Something interesting at company / something you can contribute to connection] 👋

Hi [Name]!

I came across your profile and honestly, your path from [Previous Role] to [Current Role] is exactly the kind of trajectory I'm trying to understand better. 

I'm a [Your Role/Status] currently navigating [specific challenge/transition], and I'd love to pick your brain about [specific topic] [at specific date and time] (virtual or IRL - whatever works!).

Even a few quick insights would be incredibly valuable. Happy to work around your schedule!

P.S. - That post you shared about [recent topic] really resonated with me!

Thanks for considering,
[Your Name]`}
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  rows={20}
                  className="resize-y w-full p-4 text-lg border-[color:var(--border-default)] bg-[color:var(--bg-surface-elevated)] text-[color:var(--text-base)]"
                />

                {error && (
                  <div className="text-red-600 text-lg font-medium">
                    {error}
                  </div>
                )}

                <Button
                  onClick={analyzeEmail}
                  disabled={isLoading || !draftText.trim()}
                  className="w-full py-4 text-lg"
                >
                  {isLoading ? 'Analyzing Email...' : 'Get Feedback & Rewrite'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Feedback Section */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border-default)] rounded-lg p-6">
                  <h3 className="mb-4 text-xl font-bold md:text-2xl text-green-700 dark:text-green-400 font-urbanist">
                    Strengths
                  </h3>
                  <ul className="space-y-3">
                    {analysis.aiFeedback.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">•</span>
                        <span className="text-[color:var(--text-muted)]">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border-default)] rounded-lg p-6">
                  <h3 className="mb-4 text-xl font-bold md:text-2xl text-blue-700 dark:text-blue-400 font-urbanist">
                    💡 Improvements
                  </h3>
                  <ul className="space-y-3">
                    {analysis.aiFeedback.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">•</span>
                        <span className="text-[color:var(--text-muted)]">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Side-by-side comparison */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border-default)] rounded-lg p-6">
                  <h3 className="mb-4 text-xl font-bold md:text-2xl text-[color:var(--text-base)] font-urbanist">
                    Your Original Draft
                  </h3>
                  <div className="bg-[color:var(--bg-secondary)] p-4 rounded-sm">
                    <pre className="whitespace-pre-wrap text-sm text-[color:var(--text-base)]">
                      {draftText}
                    </pre>
                  </div>
                </div>

                <div className="border border-[color:var(--border-default)] p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold md:text-2xl font-urbanist">
                      Rewritten Draft
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(analysis.aiRewrite, 'rewrite')}
                      className="flex items-center gap-2"
                    >
                      {copiedText === 'rewrite' ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                          </svg>
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="bg-[color:var(--brand-primary-lightest)] p-4 rounded-sm border border-[color:var(--brand-primary-light)]">
                    <pre className="whitespace-pre-wrap text-sm text-black">
                      {analysis.aiRewrite}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Subject line suggestions */}
              <div className="border border-[color:var(--border-default)] rounded-lg p-6">
                <h3 className="mb-6 text-xl font-bold md:text-2xl text-[color:var(--text-base)] font-urbanist">
                  📧 Subject Line Suggestions
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {analysis.aiSubjectSuggestions.map((subject, index) => (
                    <div key={index} className="bg-[color:var(--brand-primary-lightest)] p-4 rounded-sm border border-[color:var(--brand-primary-light)] relative group cursor-pointer hover:bg-[color:var(--brand-primary-light)] transition-colors">
                      <p className="font-medium text-black pr-8">
                        {subject}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(subject, `subject-${index}`)}
                        className="absolute top-2 right-2 p-1 h-auto min-h-0 w-auto"
                      >
                        {copiedText === `subject-${index}` ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                          </svg>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-center gap-4 pt-8">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setAnalysis(null);
                    setDraftText('');
                  }}
                  className="px-8 py-3"
                >
                  Analyze Another Email
                </Button>
                <a href="/history">
                  <Button className="px-8 py-3">
                    View History
                  </Button>
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}