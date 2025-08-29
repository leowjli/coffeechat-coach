import Link from 'next/link';
import { MdOutlineEmail } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";

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
              <Link href="mailto:leo.wj.li@gmail.com" className="text-[color:var(--text-muted)] hover:text-[color:var(--brand-primary)] transition-colors">
                <span className="sr-only">Email</span>
                <MdOutlineEmail size={20} />
              </Link>
              <Link href="https://www.linkedin.com/in/leoli07/" className="text-[color:var(--text-muted)] hover:text-[color:var(--brand-primary)] transition-colors">
                <span className="sr-only">LinkedIn</span>
                <FaLinkedin size={20} />
              </Link>
              <Link href="https://www.instagram.com/leo.268/" className="text-[color:var(--text-muted)] hover:text-[color:var(--brand-primary)] transition-colors">
                <span className="sr-only">Instagram</span>
                <BsInstagram size={20} />
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[color:var(--text-base)] tracking-wider uppercase">
              Features
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/scenarios" className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-base)] transition-colors">
                  Practice Sessions
                </Link>
              </li>
              <li>
                <Link href="/generate" className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-base)] transition-colors">
                  Generate Kits
                </Link>
              </li>
              <li>
                <Link href="/cold-email" className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-base)] transition-colors">
                  Email Coach
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-base)] transition-colors">
                  View History
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Start */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[color:var(--text-base)] tracking-wider uppercase">
              Quick Start
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/scenarios" className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-base)] transition-colors">
                  Choose Scenario
                </Link>
              </li>
              <li>
                <Link href="/generate" className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-base)] transition-colors">
                  Create Kit
                </Link>
              </li>
              <li>
                <Link href="/cold-email" className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-base)] transition-colors">
                  Improve Emails
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-base)] transition-colors">
                  Track Progress
                </Link>
              </li>
            </ul>
          </div>

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
        </div>
      </div>
    </footer>
  );
}