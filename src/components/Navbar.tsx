'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser, SignInButton, SignUpButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Navbar() {
  const { isSignedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[color:var(--border-subtle)] bg-[color:var(--bg-surface-elevated)]/95 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--bg-surface-elevated)]/60">
      <nav className="mx-auto max-w-7xl flex h-14 items-center px-4 sm:px-6 lg:px-8">
        {/* Logo - Coffee icon only on mobile, full text on desktop */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <span className="text-h6 font-bold text-[color:var(--text-base)]">
              ☕
            </span>
            <span className="hidden md:inline text-h6 font-bold text-[color:var(--text-base)]">
              CoffeeChat Coach
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center gap-6">
            <Link
              href="/scenarios"
              className={`text-sm font-medium transition-colors ${
                pathname === '/scenarios' 
                  ? 'text-[color:var(--text-base)] font-semibold' 
                  : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-base)]'
              }`}
            >
              Practice Now
            </Link>

            {isSignedIn ? (
              <>
                <Link
                  href="/generate"
                  className={`text-sm font-medium transition-colors ${
                    pathname === '/generate' 
                      ? 'text-[color:var(--text-base)] font-semibold' 
                      : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-base)]'
                  }`}
                >
                  Generate Kit
                </Link>
                <Link
                  href="/cold-email"
                  className={`text-sm font-medium transition-colors ${
                    pathname === '/cold-email' 
                      ? 'text-[color:var(--text-base)] font-semibold' 
                      : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-base)]'
                  }`}
                >
                  Email Coach
                </Link>
                <Link
                  href="/history"
                  className={`text-sm font-medium transition-colors ${
                    pathname === '/history' 
                      ? 'text-[color:var(--text-base)] font-semibold' 
                      : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-base)]'
                  }`}
                >
                  History
                </Link>
              </>
            ) : null}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isSignedIn ? (
              <UserButton />
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm">
                    Join
                  </Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2 ml-auto">
          <ThemeToggle />
          {isSignedIn && <UserButton />}
          
          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="p-2 text-[color:var(--text-base)] hover:text-[color:var(--text-muted)] transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                // X icon when menu is open
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                // Hamburger icon when menu is closed
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Container Width */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 bg-black/20 z-40" onClick={closeMenu} />
          <div className="fixed top-14 left-0 right-0 bg-[color:var(--bg-surface-elevated)] border-b border-[color:var(--border-subtle)] z-50 shadow-lg">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/scenarios"
                  className={`text-base font-medium transition-colors py-2 ${
                    pathname === '/scenarios' 
                      ? 'text-[color:var(--brand-primary)] font-semibold' 
                      : 'text-[color:var(--text-base)] hover:text-[color:var(--brand-primary)]'
                  }`}
                  onClick={closeMenu}
                >
                  Practice Now
                </Link>

                {isSignedIn ? (
                  <>
                    <Link
                      href="/generate"
                      className={`text-base font-medium transition-colors py-2 ${
                        pathname === '/generate' 
                          ? 'text-[color:var(--brand-primary)] font-semibold' 
                          : 'text-[color:var(--text-base)] hover:text-[color:var(--brand-primary)]'
                      }`}
                      onClick={closeMenu}
                    >
                      Generate Kit
                    </Link>
                    <Link
                      href="/cold-email"
                      className={`text-base font-medium transition-colors py-2 ${
                        pathname === '/cold-email' 
                          ? 'text-[color:var(--brand-primary)] font-semibold' 
                          : 'text-[color:var(--text-base)] hover:text-[color:var(--brand-primary)]'
                      }`}
                      onClick={closeMenu}
                    >
                      Email Coach
                    </Link>
                    <Link
                      href="/history"
                      className={`text-base font-medium transition-colors py-2 ${
                        pathname === '/history' 
                          ? 'text-[color:var(--brand-primary)] font-semibold' 
                          : 'text-[color:var(--text-base)] hover:text-[color:var(--brand-primary)]'
                      }`}
                      onClick={closeMenu}
                    >
                      History
                    </Link>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2 pt-2">
                    <SignInButton mode="modal">
                      <Button variant="ghost" className="w-full justify-start text-base py-3">
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button className="w-full justify-start text-base py-3">
                        Join
                      </Button>
                    </SignUpButton>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}