'use client';

import { PropertySubmissionForm } from "@/components/property-submission-form";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SubmitPropertyPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      // If not authenticated or user is not a host, redirect to login.
      if (!isAuthenticated || !user?.roles.includes('host')) {
        // You could redirect to a specific "unauthorized" page as well
        router.push('/login');
      }
    }
  }, [isAuthenticated, user, router, isClient]);

  // Render a loading state or null while checking auth to avoid flash of content
  if (!isClient || !isAuthenticated || !user?.roles.includes('host')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-muted-foreground mb-6">You must be logged in as a host to view this page.</p>
        <div className="flex gap-4">
            <Button asChild>
                <Link href="/login">Login as Host</Link>
            </Button>
            <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
            </Button>
        </div>
      </div>
    );
  }

  // If authenticated and is a host, show the form
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">List your Property</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Join our community of hosts and start earning today.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <PropertySubmissionForm />
        </div>
      </div>
    </div>
  );
}
