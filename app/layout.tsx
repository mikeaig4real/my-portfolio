import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Michael Aigbovbiosa — Senior Full Stack / AI Engineer | Neobrutalism Bento Portfolio',
  description: 'Portfolio of Michael Aigbovbiosa, Senior Full Stack & Agentic AI Engineer with 7+ years experience in Next.js, React, Node.js, Python, FastAPI, and MongoDB.',
  keywords: [
    'Michael Aigbovbiosa',
    'Senior Full Stack Engineer',
    'AI Engineer',
    'Agentic AI',
    'Next.js Bento Grid Portfolio',
    'Neobrutalism Design System',
    'MongoDB',
    'TypeScript',
  ],
  authors: [{ name: 'Michael Aigbovbiosa' }],
  openGraph: {
    title: 'Michael Aigbovbiosa — Neobrutalism Bento Portfolio',
    description: 'Explore projects, work experience, AI certifications, and interactive bento cards.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body suppressHydrationWarning className="antialiased selection:bg-yellow-300 selection:text-black">
        {children}
      </body>
    </html>
  );
}
