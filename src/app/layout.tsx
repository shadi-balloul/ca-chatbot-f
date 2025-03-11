// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { UserProvider } from '@/context/UserContext';

export const metadata: Metadata = {
  title: 'Chatbot Application',
  description: 'Gemini-based Chatbot Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}