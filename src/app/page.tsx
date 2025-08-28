import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-[color:var(--bg-base)]">
      <Navbar />

      {/* Hero Section */}
      <section className="px-[var(--spacing-global)] py-[var(--spacing-section-lg)]">
        <div className="w-full max-w-full lg:container lg:max-w-[var(--container-lg)] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-w-0">
            <div className="space-y-6 max-w-full min-w-0">
              <p className="text-lg text-[color:var(--text-muted)] max-w-full break-words">
                UNLOCK YOUR POTENTIAL WITH COFFEECHAT COACH
              </p>
              <h1 className="text-h2 md:text-h1 font-bold text-[color:var(--text-base)] leading-tight max-w-full break-words">
                CONNECT, PRACTICE, SUCCEED
              </h1>
              <p className="text-lg text-[color:var(--text-muted)] max-w-full break-words">
                Transform your networking skills with our AI-powered tools designed for students and new grads.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/scenarios">
                  <Button size="lg">Start</Button>
                </Link>
                <Link href="/generate">
                  <Button variant="secondary" size="lg">Learn More</Button>
                </Link>
              </div>
            </div>

            <div className="relative w-full min-w-0">
              <div className="w-full aspect-[4/3] bg-[color:var(--bg-surface)] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-lg)]">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">☕</div>
                    <p className="text-[color:var(--text-muted)]">AI-Powered Practice Platform</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="px-[var(--spacing-global)] py-[var(--spacing-section-lg)] bg-[color:var(--bg-surface)]">
        <div className="w-full max-w-full lg:container lg:max-w-[var(--container-lg)] mx-auto text-center">
          <h2 className="text-h2 font-bold text-[color:var(--text-base)] mb-6 max-w-full break-words">
            UNLOCK YOUR NETWORKING POTENTIAL WITH AI TOOLS
          </h2>
          <p className="text-lg text-[color:var(--text-muted)] max-w-3xl mx-auto mb-12 break-words">
            Our AI-powered tools will help you practice networking and improve your outreach messages to make connections that move your career forward.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-[color:var(--brand-primary-lightest)] rounded-full flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-h6 font-semibold text-[color:var(--text-base)] max-w-full break-words">
                PRACTICE NETWORKING WITH AI SIMULATIONS
              </h3>
              <p className="text-[color:var(--text-muted)] break-words">
                Roleplay realistic coffee chats with recruiters, alumni, and PMs
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-[color:var(--brand-primary-lightest)] rounded-full flex items-center justify-center">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-h6 font-semibold text-[color:var(--text-base)] max-w-full break-words">
                GENERATE TAILORED CONVERSATION STARTER KITS
              </h3>
              <p className="text-[color:var(--text-muted)] break-words">
                Get personalized conversation starters based on LinkedIn profiles
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-[color:var(--brand-primary-lightest)] rounded-full flex items-center justify-center">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="text-h6 font-semibold text-[color:var(--text-base)] max-w-full break-words">
                CRAFT EFFECTIVE EMAILS WITH AI ASSISTANCE
              </h3>
              <p className="text-[color:var(--text-muted)] break-words">
                Get feedback and AI rewrites for stronger outreach messages
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary CTA Section */}
      <section className="px-[var(--spacing-global)] py-[var(--spacing-section-lg)]">
        <div className="w-full max-w-full lg:container lg:max-w-[var(--container-lg)] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-w-0">
            <div className="space-y-6 max-w-full min-w-0">
              <div className="inline-block text-center sm:text-left px-3 py-1 bg-[color:var(--brand-accent)] text-[color:var(--text-base)] text-sm font-medium rounded-full break-words">
                ☕ UNLOCK YOUR NETWORKING POTENTIAL WITH COFFEECHAT COACH
              </div>
              <h2 className="text-h4 font-bold text-[color:var(--text-base)] max-w-full break-words">
                <span className="font-extrabold text-[color:var(--brand-primary)]">Transform</span> your networking skills with AI-powered conversations and feedback tools. <br />
                <span className="font-extrabold text-[color:var(--brand-primary)]">Practice</span> networking scenarios designed and gain conversation starters to connect authentically.
              </h2>
              <Link href="/scenarios">
                <Button size="lg" className="w-fit">
                  Start practicing
                </Button>
              </Link>
            </div>

            <div className="relative w-full min-w-0">
              <div className="w-full aspect-[4/3] bg-[color:var(--bg-surface)] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-lg)]">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">🎯</div>
                    <p className="text-[color:var(--text-muted)]">Personalized Practice</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-[var(--spacing-global)] py-[var(--spacing-section-lg)] bg-[color:var(--bg-surface)]">
        <div className="w-full max-w-full lg:container lg:max-w-[var(--container-lg)] mx-auto text-center">
          <h2 className="text-h3 font-bold text-[color:var(--text-base)] mb-12 max-w-full break-words">
            USER SUCCESS
          </h2>
          <p className="text-[color:var(--text-muted)] mb-12 break-words">
            This platform transformed my networking experience completely!
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-[color:var(--bg-base)] rounded-[var(--radius-md)] p-6 shadow-[var(--shadow-sm)]">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">⭐</span>
                ))}
              </div>
              <p className="text-[color:var(--text-base)] mb-4 break-words">
                &ldquo;THE CONVERSATION STARTER KITS HELPED MY REACH OUT TO PROFESSIONALS SO EASILY!&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[color:var(--brand-primary-lightest)] rounded-full mr-3"></div>
                <div className="text-center sm:text-left">
                  <p className="font-medium text-[color:var(--text-base)]">Emily Johnson</p>
                  <p className="text-sm text-[color:var(--text-muted)]">Marketing Intern, XYZ Corp</p>
                </div>
              </div>
            </div>

            <div className="bg-[color:var(--bg-base)] rounded-[var(--radius-md)] p-6 shadow-[var(--shadow-sm)]">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">⭐</span>
                ))}
              </div>
              <p className="text-[color:var(--text-base)] mb-4 break-words">
                &ldquo;THE PLATFORM HELPED MY REFINE MY EMAILS PERFECTLY!&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[color:var(--brand-primary-lightest)] rounded-full mr-3"></div>
                <div className="text-center sm:text-left">
                  <p className="font-medium text-[color:var(--text-base)]">Alex Chen</p>
                  <p className="text-sm text-[color:var(--text-muted)]">Software Engineer, ABC Startup</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-[var(--spacing-global)] py-[var(--spacing-section-lg)]">
        <div className="w-full max-w-full lg:container lg:max-w-[var(--container-md)] mx-auto text-center space-y-8">
          <h2 className="text-h2 font-bold text-[color:var(--text-base)] max-w-full break-words">
            START YOUR NETWORKING JOURNEY TODAY
          </h2>
          <p className="text-lg text-[color:var(--text-muted)] break-words">
            Join thousands of students and professionals who have transformed their networking skills
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scenarios">
              <Button size="lg">Practice</Button>
            </Link>
            <Link href="/generate">
              <Button variant="secondary" size="lg">Learn More</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
