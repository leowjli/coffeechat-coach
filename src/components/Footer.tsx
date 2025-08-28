import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[color:var(--bg-surface)] border-t border-[color:var(--border-subtle)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-h6 font-bold text-[color:var(--text-base)]">
                ☕ CoffeeChat Coach
              </span>
            </Link>
            <p className="text-sm text-[color:var(--text-muted)] max-w-xs">
              Transform your networking skills with AI-powered practice and conversation tools.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-[color:var(--text-muted)] hover:text-[color:var(--brand-primary)]">
                <span className="sr-only">Email</span>
                📘
              </Link>
              <Link href="#" className="text-[color:var(--text-muted)] hover:text-[color:var(--brand-primary)]">
                <span className="sr-only">LinkedIn</span>
                💼
              </Link>
              <Link href="#" className="text-[color:var(--text-muted)] hover:text-[color:var(--brand-primary)]">
                <span className="sr-only">Instagram</span>
                📷
              </Link>
            </div>
          </div>

          {/* About Us */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[color:var(--text-base)] tracking-wider uppercase">
              About Us
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-base)]">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-base)]">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-base)]">
                  Blog Posts
                </Link>
              </li>
              <li>
                <Link href="/scenarios" className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-base)]">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Link Site
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[color:var(--text-base)] tracking-wider uppercase">
              Link Site
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-base)]">
                  Link Seven
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-base)]">
                  Link Eight
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-base)]">
                  Link Nine
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-base)]">
                  Link Ten
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[color:var(--text-base)] tracking-wider uppercase">
              Contact
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-[color:var(--text-muted)]">
                (206) 765-7055<br />
                leo.wj.li@gmail.com
              </p>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-[color:var(--border-subtle)] flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-[color:var(--text-muted)]">
            © 2025 CoffeeChat Coach. All rights reserved.
          </p>
          {/* <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-base)]">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-base)]">
              Terms of Use
            </Link>
            <Link href="#" className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-base)]">
              Cookie Policy
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
}