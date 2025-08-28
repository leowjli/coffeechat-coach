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
                  <h3 className="mb-4 text-xl font-bold md:text-2xl font-urbanist">
                    Rewritten Draft
                  </h3>
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
                    <div key={index} className="bg-[color:var(--brand-primary-lightest)] p-4 rounded-sm border border-[color:var(--brand-primary-light)]">
                      <p className="font-medium text-black">
                        {subject}
                      </p>
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