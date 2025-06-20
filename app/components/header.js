'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const { token, user, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    token = sessionStorage.getItem('token');
  if (token) {
    console.log('Token exists:', token);
    // You can update state or context here if needed
  } else {
    console.log('No token found');
  }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleProtectedRoute = (e, href) => {
    e.preventDefault();
    if (!token) {
      router.push('/login');
    } else {
      router.push(href);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex-1 md:flex md:items-center md:gap-12">
            <a className="group flex items-center space-x-3 hover:scale-105 transition-transform duration-200" href="/">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                  <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Blog App
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Insights & Stories</p>
              </div>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex lg:items-center lg:gap-12">
            <nav>
              <ul className="flex items-center gap-8">
                <li>
                  <a href="/" className="relative text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 group py-2">
                    Home
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                  </a>
                </li>
                <li>
                  <a
                    href="/blogs"
                    onClick={(e) => handleProtectedRoute(e, '/blogs')}
                    className="relative text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 group py-2 cursor-pointer"
                  >
                    My Blog
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                  </a>
                </li>
                <li>
                  <a href="/about" className="relative text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 group py-2">
                    About
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                  </a>
                </li>
              </ul>
            </nav>

            {/* Auth buttons */}
            <div className="flex items-center gap-4">
              {token ? (
                <>
                  <span className="text-gray-600 font-medium">Hi, {user}</span>
                  <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a href="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                    Login
                  </a>
                  <a
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Get Started
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <button onClick={toggleMenu} className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200" aria-label="Toggle menu">
              <div className="w-6 h-6 relative">
                <span className={`absolute top-1 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 top-2.5' : ''}`}></span>
                <span className={`absolute top-2.5 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`absolute top-4 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 top-2.5' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-4 border-t border-gray-100">
            <nav className="space-y-4">
              <a href="/" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium">
                Home
              </a>
              <a
                href="/blogs"
                onClick={(e) => {
                  e.preventDefault();
                  handleProtectedRoute(e, '/blogs');
                  setIsMenuOpen(false);
                }}
                className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium"
              >
                My Blog
              </a>
              <a href="/about" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium">
                About
              </a>
            </nav>
            <div className="pt-4 mt-4 border-t border-gray-100 space-y-3">
              {token ? (
                <>
                  <span className="block px-4 py-2 text-gray-600 font-medium">Hi, {user}</span>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a href="/login" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium">
                    Login
                  </a>
                  <a
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Get Started
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
