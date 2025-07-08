'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, LogIn, UserPlus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const isHostPage = pathname.startsWith('/host');
  
  // A mock user state. In a real app, this would come from a context or session.
  const user = { role: isHostPage ? 'host' : 'guest' };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Home className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold font-headline">PropertyLink</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link
            href="/search"
            className="text-foreground/80 transition-colors hover:text-foreground"
          >
            Search
          </Link>
          <Link
            href="/host/submit-property"
            className="text-foreground/80 transition-colors hover:text-foreground"
          >
            Become a Host
          </Link>
        </nav>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="sm" asChild>
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
            <Button size="sm" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/signup">
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Link>
            </Button>
        </div>
      </div>
    </header>
  );
}
