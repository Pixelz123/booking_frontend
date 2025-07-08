
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
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function Header() {
  const { isAuthenticated, user, logout, login, token } = useAuth();
  const [isBecomingHost, setIsBecomingHost] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleBecomeHost = async () => {
    // This action is only available to authenticated users, but we double-check.
    if (!isAuthenticated || !token) {
        toast({ title: "Please log in first", variant: "destructive" });
        router.push('/login');
        return;
    }

    setIsBecomingHost(true);
    try {
        const response = await fetch('/api/auth/become-host', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to upgrade your account.");
        }

        // The backend has updated the user's role. Now, log them out.
        logout();

        toast({
            title: "Account Upgraded!",
            description: "You are now a host. Please log in again to access host features.",
        });

        // Redirect to login page for re-authentication as a host.
        router.push('/login');

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive"
        });
    } finally {
        setIsBecomingHost(false);
    }
  };

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
          
          {isAuthenticated && user ? (
              user.roles.includes('HOST') ? (
                <Link
                  href="/host/my-properties"
                  className="text-foreground/80 transition-colors hover:text-foreground"
                >
                  Host Dashboard
                </Link>
              ) : (
                 <button
                    onClick={handleBecomeHost}
                    disabled={isBecomingHost}
                    className="text-foreground/80 transition-colors hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isBecomingHost ? 'Upgrading...' : 'Become a Host'}
                 </button>
              )
          ) : (
             <Link
                href="/signup?role=HOST"
                className="text-foreground/80 transition-colors hover:text-foreground"
              >
                Become a Host
              </Link>
          )}

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
