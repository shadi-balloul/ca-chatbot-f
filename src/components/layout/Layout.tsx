// src/components/layout/Layout.tsx
import React from 'react';
import Link from 'next/link'; 

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold">AI Chatbot in Bemo Bank</h1>
          <nav>
                        <ul className="flex space-x-4">
                            <li>
                                <Link href="/" className="hover:text-blue-200">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="hover:text-blue-200"> {/* ADD DASHBOARD LINK */}
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </nav>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4">
        {children}
      </main>
      <footer className="bg-gray-100 p-4 text-center text-gray-600 text-sm">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} Chatbot Application Development Team
        </div>
      </footer>
    </div>
  );
}