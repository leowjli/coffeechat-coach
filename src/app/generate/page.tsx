'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { CoffeeChatKit } from '@/lib/ai';

interface UserInfo {
  name: string;
  role: string;
  company: string;
  background: string;
  goals: string;
}

interface TargetInfo {
  profileUrl: string;
  profileText: string;
}

export default function GeneratePage() {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    role: '',
    company: '',
    background: '',
    goals: ''
  });
  const [targetInfo, setTargetInfo] = useState<TargetInfo>({
    profileUrl: '',
    profileText: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [kit, setKit] = useState<CoffeeChatKit | null>(null);
  const [error, setError] = useState('');


  const generateKit = async () => {
    // Validate required fields
    if (!userInfo.name.trim() || !userInfo.role.trim() || !targetInfo.profileText.trim()) {
      setError('Please fill in your name, role, and the target person\'s profile information');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInfo: {
            name: userInfo.name.trim(),
            role: userInfo.role.trim(),
            company: userInfo.company.trim(),
            background: userInfo.background.trim(),
            goals: userInfo.goals.trim()
          },
          targetInfo: {
            profileUrl: targetInfo.profileUrl.trim() || undefined,
            profileText: targetInfo.profileText.trim()
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate kit');
      }

      const data = await response.json();
      setKit(data.kit);

    } catch (error) {
      console.error('Error generating kit:', error);

      if (error instanceof Error) {
        if (error.message.includes('Too many requests')) {
          setError('Too many requests. Please wait a moment and try again.');
        } else if (error.message.includes('Please sign in')) {
          setError('Please sign in to use this feature.');
        } else if (error.message.includes('Unable to generate kit')) {
          setError('Unable to generate kit at the moment. Please try again.');
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
      <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28 bg-[color:var(--bg-surface)]">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start gap-8">
            <div className="grid md:grid-cols-2 gap-12 items-center min-w-0">
              <div className="space-y-6 max-w-[85%] min-w-0">
                <h1 className="flex flex-col text-5xl font-semibold md:text-6xl lg:text-7xl text-[color:var(--text-base)] font-urbanist">
                  <span>Create</span>
                  <span className="text-[color:var(--brand-primary)]">Conversation</span>
                  <span>Starters</span>
                </h1>
                                  <div className="flex flex-col mt-5 lg:mt-0">
                    <p className="md:text-md font-medium">
                      Create personalized conversation starters with AI.
                    </p>
                    <p className="md:text-md font-medium">
                      Paste the content of a LinkedIn profile and get tailored networking prompts.
                    </p>
                  </div>
              </div>

              <div className="relative w-full min-w-0">
                <div className="w-full aspect-[4/3] bg-[color:var(--bg-base)] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-lg)]">
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <div className="text-center space-y-4">
                      <img
                        src="/imgs/typing-rafiki.png"
                        alt="AI-Powered Conversation Generation"
                        className="w-full h-auto max-h-full object-contain"
                      />
                      <p className="text-[color:var(--text-muted)] text-sm">
                        <a href="https://storyset.com/online" className="hover:underline">Online illustrations by Storyset</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28 bg-[color:var(--bg-secondary)]">
        <div className="mx-auto max-w-7xl">

          {!kit ? (
            <>
              <div className="flex flex-col md:flex-row gap-8">
                {/* User Information Section */}
                <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border-default)] rounded-lg p-8">
                  <div className="mb-6 text-center">
                    <h2 className="mb-3 text-2xl font-bold md:text-3xl text-[color:var(--text-base)] font-urbanist">
                      👋 Your Information
                    </h2>
                    <p className="text-[color:var(--text-muted)]">
                      Tell us about yourself so we can create your personalized one-line pitch
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-semibold text-[color:var(--text-base)] mb-2 h-6 flex items-center">
                        Your Name *
                      </label>
                      <Input
                        placeholder=""
                        required
                        value={userInfo.name}
                        onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                        className="w-full p-3 rounded-sm text-base border-[color:var(--border-default)] bg-[color:var(--bg-surface-elevated)] text-[color:var(--text-base)]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-[color:var(--text-base)] mb-2 h-6 flex items-center">
                        Your Current Role *
                      </label>
                      <Input
                        placeholder="CS Student, SWE, PM"
                        required
                        value={userInfo.role}
                        onChange={(e) => setUserInfo({ ...userInfo, role: e.target.value })}
                        className="w-full p-3 rounded-sm text-base border-[color:var(--border-default)] bg-[color:var(--bg-surface-elevated)] text-[color:var(--text-base)]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-[color:var(--text-base)] mb-2 h-6 flex items-center">
                        Your Company/School
                      </label>
                      <Input
                        placeholder=""
                        value={userInfo.company}
                        onChange={(e) => setUserInfo({ ...userInfo, company: e.target.value })}
                        className="w-full p-3 rounded-sm text-base border-[color:var(--border-default)] bg-[color:var(--bg-surface-elevated)] text-[color:var(--text-base)]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-[color:var(--text-base)] mb-2 h-6 flex items-center">
                        Your Goals *
                      </label>
                      <Input
                        placeholder="breaking into PM, finding a mentor"
                        required
                        value={userInfo.goals}
                        onChange={(e) => setUserInfo({ ...userInfo, goals: e.target.value })}
                        className="w-full p-3 rounded-sm text-base border-[color:var(--border-default)] bg-[color:var(--bg-surface-elevated)] text-[color:var(--text-base)]"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-[color:var(--text-base)] mb-2">
                      Your Background/Interests
                    </label>
                    <Textarea
                      placeholder="This helps create a more authentic one-line pitch."
                      value={userInfo.background}
                      onChange={(e) => setUserInfo({ ...userInfo, background: e.target.value })}
                      rows={3}
                      className="resize-y w-full p-3 rounded-sm text-base border-[color:var(--border-default)] bg-[color:var(--bg-surface-elevated)] text-[color:var(--text-base)]"
                    />
                  </div>
                </div>

                {/* Target Information Section */}
                <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border-default)] rounded-lg p-8">
                  <div className="mb-6 text-center">
                    <h2 className="mb-3 text-2xl font-bold md:text-3xl text-[color:var(--text-base)] font-urbanist">
                      Person You Want to Network With
                    </h2>
                    <p className="text-[color:var(--text-muted)]">
                      Paste their LinkedIn profile information to find shared interests and create conversation starters
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* <div>
                      <label className="block text-sm font-semibold text-[color:var(--text-base)] mb-2">
                        LinkedIn Profile URL (Optional)
                      </label>
                      <Input
                        placeholder="https://linkedin.com/in/their-profile"
                        value={targetInfo.profileUrl}
                        onChange={(e) => setTargetInfo({...targetInfo, profileUrl: e.target.value})}
                        className="w-full p-3 rounded-sm text-base border-[color:var(--border-default)] bg-[color:var(--bg-surface-elevated)] text-[color:var(--text-base)]"
                      />
                    </div> */}

                    <div>
                      <label className="block text-sm font-semibold text-[color:var(--text-base)] mb-2">
                        Their Profile Content *
                      </label>
                      <Textarea
                        placeholder="Paste their profile info - About, work experience, education, projects, etc."
                        required
                        value={targetInfo.profileText}
                        onChange={(e) => setTargetInfo({ ...targetInfo, profileText: e.target.value })}
                        rows={8}
                        className="resize-y w-full p-3 rounded-sm text-base border-[color:var(--border-default)] bg-[color:var(--bg-surface-elevated)] text-[color:var(--text-base)]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <div className="mt-8 bg-[color:var(--bg-surface)] border border-[color:var(--border-default)] rounded-lg p-6">
                {error && (
                  <div className="mb-4 text-red-600 text-base font-medium">
                    {error}
                  </div>
                )}

                <Button
                  onClick={generateKit}
                  disabled={isLoading || !userInfo.name.trim() || !userInfo.role.trim() || !targetInfo.profileText.trim()}
                  className="w-full py-4 text-lg"
                >
                  {isLoading ? 'Generating Personalized Kit...' : 'Generate CoffeeChat Kit'}
                </Button>

                <p className="mt-3 text-sm text-[color:var(--text-muted)] text-center">
                  This will create conversation starters based on shared interests between you and your networking target
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-8">
                <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border-default)] rounded-lg p-8 text-center">
                  <h2 className="mb-5 text-4xl font-bold md:mb-6 md:text-5xl lg:text-6xl text-[color:var(--brand-primary)] font-urbanist">
                    ☕ CoffeeChat Kit Generated!
                  </h2>
                  <p className="md:text-md text-[color:var(--text-muted)]">
                    Use these personalized conversation starters for your networking chat
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border-default)] rounded-lg p-6">
                    <h3 className="mb-4 text-xl font-bold md:text-2xl text-[color:var(--text-base)] font-urbanist">
                      Shared Interests
                    </h3>
                    <ul className="space-y-3">
                      {kit.sharedInterests.map((interest, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-[color:var(--brand-primary)] font-bold">•</span>
                          <span className="text-[color:var(--text-muted)]">{interest}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border-default)] rounded-lg p-6">
                    <h3 className="mb-4 text-xl font-bold md:text-2xl text-[color:var(--text-base)] font-urbanist">
                      💬 Conversation Starters
                    </h3>
                    <ul className="space-y-3">
                      {kit.starters.map((starter, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-[color:var(--brand-primary)] font-bold">•</span>
                          <span className="text-[color:var(--text-muted)]">{starter}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[color:var(--bg-surface)] border border-[color:var(--border-default)] rounded-lg p-6">
                    <h3 className="mb-4 text-xl font-bold md:text-2xl text-[color:var(--text-base)] font-urbanist">
                      Follow-up Questions
                    </h3>
                    <ul className="space-y-3">
                      {kit.followUps.map((followUp, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-[color:var(--brand-primary)] font-bold">•</span>
                          <span className="text-[color:var(--text-muted)]">{followUp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col justify-between bg-[color:var(--bg-surface)] border border-[color:var(--border-default)] rounded-lg p-6">
                    <div>
                      <h3 className="mb-4 text-xl font-bold md:text-2xl text-[color:var(--text-base)] font-urbanist">
                        🎤 Add these + one-line pitch about yourself
                      </h3>
                      <p className="font-medium text-[color:var(--text-base)] text-lg">
                        {kit.oneLinePitch}
                      </p>
                    </div>
                    <p className="font-medium text-[color:var(--text-base)] text-lg">
                      You&apos;re good to go, happy coffeechatting!
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 pt-8">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setKit(null);
                    setUserInfo({
                      name: '',
                      role: '',
                      company: '',
                      background: '',
                      goals: ''
                    });
                    setTargetInfo({
                      profileUrl: '',
                      profileText: ''
                    });
                  }}
                  className="px-8 py-3"
                >
                  Generate Another Kit
                </Button>
                <a href="/scenarios">
                  <Button className="px-8 py-3">
                    Start Practice Session
                  </Button>
                </a>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}