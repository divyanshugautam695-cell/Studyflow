import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'StudyFlow AI — Study smarter',
  description: 'Adaptive AI learning, practice and exam preparation for students.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
