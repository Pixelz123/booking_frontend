'use client';

import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Home, LogIn, UserPlus, LogOut, UserCircle, PlusCircle } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();

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
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5" />
                  <span>{user.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.roles.includes('HOST') && (
                  <>
                    <DropdownMenuItem asChild>
                       <Link href="/host/my-properties">My Properties</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                       <Link href="/host/submit-property">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Submit New Property
                       </Link>
                    </DropdownMenuItem>
                  </>
                )}
                 <DropdownMenuItem asChild>
                     <Link href="/bookings">My Bookings</Link>
                  </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
                <LogIn className="h-4 w-4" />
                Login
              </Link>
              <Link href="/signup" className={cn(buttonVariants({ size: 'sm' }), 'bg-accent text-accent-foreground hover:bg-accent/90')}>
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
