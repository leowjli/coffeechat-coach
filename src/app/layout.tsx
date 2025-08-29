import type { Metadata } from "next";
import { Urbanist, Poppins } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "CoffeeChat Coach",
  description: "Practice networking and craft impactful cold outreach messages with AI",
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: "CoffeeChat Coach",
    description: "Practice networking and craft impactful cold outreach messages with AI",
    type: "website",
    url: "https://coffeechat-coach.vercel.app",
    siteName: "CoffeeChat Coach",
    images: [
      {
        url: "/imgs/coffeechat-coach-preview.png",
        width: 1200,
        height: 630,
        alt: "CoffeeChat Coach - AI-powered networking practice platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CoffeeChat Coach",
    description: "Practice networking and craft impactful cold outreach messages with AI",
    images: ["/imgs/conversation-cuate.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        </head>
        <body className={`${urbanist.variable} ${poppins.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
