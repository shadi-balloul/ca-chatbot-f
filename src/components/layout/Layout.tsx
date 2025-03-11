// src/components/layout/Layout.tsx
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold">Chatbot Application</h1>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4">
        {children}
      </main>
      <footer className="bg-gray-100 p-4 text-center text-gray-600 text-sm">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} Chatbot Application
        </div>
      </footer>
    </div>
  );
}