'use client';

import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { scenarios } from '@/lib/scenarios';
import { useUser, SignInButton } from '@clerk/nextjs';

export default function ScenariosPage() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-[color:var(--bg-base)]">
      <Navbar />

      {/* Header Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28 flex items-center">
        <div className="mx-auto max-w-7xl w-full">
          <div className="flex flex-col gap-3 max-w-3xl">
            <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl text-[color:var(--text-base)] leading-[1.2] font-urbanist">
              Master <span className="text-[color:var(--brand-primary)]">Networking</span> with AI
            </h1>
            <p className="md:text-md text-[color:var(--text-muted)]">
              Our AI-powered chat simulation helps you practice real-life networking scenarios, building your confidence and communication skills. Start connecting authentically and prepare for successful coffee chats today!
            </p>
          </div>
        </div>
      </section>

      {/* Scenarios Grid */}
      <section id="scenarios" className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28 bg-[color:var(--bg-secondary)]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12 md:mb-18 lg:mb-20">
            <h2 className="mb-5 text-4xl font-bold md:mb-6 md:text-5xl lg:text-6xl text-[color:var(--text-base)] font-urbanist">
              Choose Your Practice Scenario
            </h2>
            <p className="md:text-md text-[color:var(--text-muted)]">
              Select a networking scenario to practice with AI
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {scenarios.map((scenario) => (
              <div key={scenario.id} className="border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] rounded-lg p-6 flex flex-col h-full">
                <div className="flex-1">
                  <h3 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl text-[color:var(--text-base)] font-urbanist">
                    {scenario.title}
                  </h3>
                  <p className="mb-2 text-sm font-semibold text-[color:var(--text-muted)]">
                    {scenario.persona}
                  </p>
                  <p className="text-[color:var(--text-muted)] mb-6">
                    {scenario.description}
                  </p>
                </div>
                {isSignedIn ? (
                  <Link href={`/chat/${scenario.id}`}>
                    <Button className="w-full">
                      Start Practice
                    </Button>
                  </Link>
                ) : (
                  <SignInButton mode="modal">
                    <Button className="w-full">
                      Start Practice
                    </Button>
                  </SignInButton>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 md:mt-18 lg:mt-20 text-center">
            <p className="mb-6 md:text-md text-[color:var(--text-muted)]">
              Not ready to practice? Generate a conversation kit first.
            </p>
            {isSignedIn ? (
              <Link href="/generate">
                <Button variant="secondary">
                  Generate CoffeeChat Kit
                </Button>
              </Link>
            ) : (
              <SignInButton mode="modal">
                <Button variant="secondary">
                  Generate CoffeeChat Kit
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}