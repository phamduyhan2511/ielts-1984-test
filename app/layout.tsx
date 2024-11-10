// app/layout.tsx
import '../src/styles/globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: '[IELTS 1984 - YouPass] Online Test',
  description: 'Online Test - Front End Developer',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
