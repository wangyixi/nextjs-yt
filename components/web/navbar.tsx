'use client';

import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ModeToggle } from './theme-toggle';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if token exists
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          method: 'GET',
          credentials: 'include',
        });
        setIsLoggedIn(response.ok);
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="w-full py-5 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-3xl font-bold">
          <h1 className="text-3xl font-bold">
            Next<span className="text-blue-500">Pro</span>
          </h1>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            className={`${isActive('/') ? 'text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900'}`}
            href="/"
          >
            Home
          </Link>
          <Link
            className={`${isActive('/blog') ? 'text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900'}`}
            href="/blog"
          >
            Blog
          </Link>
          <Link
            className={`${isActive('/create') ? 'text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900'}`}
            href="/create"
          >
            Create
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!isLoading && !isLoggedIn && (
          <>
            <Link className={buttonVariants({ variant: 'default' })} href="/auth/sign-up">
              Sign up
            </Link>
            <Link className={buttonVariants({ variant: 'outline' })} href="/auth/login">
              Login
            </Link>
          </>
        )}
        {!isLoading && isLoggedIn && (
          <button className={buttonVariants({ variant: 'outline' })} onClick={handleLogout}>
            Logout
          </button>
        )}
        <ModeToggle />
      </div>
    </nav>
  );
}
