'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const { user, isLoading } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const [tokens, setTokens] = useState<{ idToken: any; accessToken: string | null }>({ idToken: null, accessToken: null });

  useEffect(() => {
    if (user) {
      // Fetch tokens from the API route
      fetch('/api/tokens')
        .then(res => res.json())
        .then(data => setTokens(data))
        .catch(err => console.error('Failed to fetch tokens:', err));
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showDropdown && !target.closest('.relative')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  return (
    <header className="bg-red-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <span className="text-3xl">🍕</span>
            <span className="text-2xl font-bold">Pizza42</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            {!isLoading && (
              <>
                {user ? (
                  <div className="relative">
                    {/* User Icon Button */}
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center space-x-2 bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg transition-colors"
                      aria-label="User menu"
                    >
                      <div className="w-8 h-8 bg-white text-red-600 rounded-full flex items-center justify-center font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </div>
                      <span className="text-sm">{user.name || user.email}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-96 bg-white text-gray-800 rounded-lg shadow-2xl border border-gray-200 z-50">
                        <div className="p-4 border-b border-gray-200">
                          <p className="text-sm font-semibold text-gray-600 mb-1">Logged in as</p>
                          <p className="text-sm font-bold">{user.email}</p>
                        </div>

                        {/* ID Token Section */}
                        {tokens.idToken && (
                          <div className="p-4 border-b border-gray-200">
                            <p className="text-xs font-semibold text-gray-600 mb-2">🆔 ID Token (Decoded)</p>
                            <div className="bg-gray-50 p-3 rounded border border-gray-200 max-h-48 overflow-y-auto">
                              <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words font-mono">
                                {JSON.stringify(tokens.idToken, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}

                        {/* Access Token Section */}
                        {tokens.accessToken && (
                          <div className="p-4 border-b border-gray-200">
                            <p className="text-xs font-semibold text-gray-600 mb-2">🔑 Access Token</p>
                            <div className="bg-gray-50 p-3 rounded border border-gray-200 max-h-32 overflow-y-auto">
                              <pre className="text-xs text-gray-700 whitespace-pre-wrap break-all font-mono">
                                {tokens.accessToken}
                              </pre>
                            </div>
                          </div>
                        )}

                        {/* Logout Button */}
                        <div className="p-3">
                          <Link
                            href="/api/auth/logout"
                            className="block w-full text-center bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                            onClick={() => setShowDropdown(false)}
                          >
                            Logout
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/api/auth/login"
                    className="bg-white text-red-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Login
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
