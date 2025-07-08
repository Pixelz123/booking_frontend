'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { PropertySummary } from '@/lib/types';
import { PropertyCard } from '@/components/property-card';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyPropertiesPage() {
  const { isAuthenticated, user, token } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [myProperties, setMyProperties] = useState<PropertySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      if (!isAuthenticated || !user?.roles.includes('HOST')) {
        router.push('/login');
      } else if (token) {
        const fetchHostProperties = async () => {
          setIsLoading(true);
          try {
            const response = await fetch('/api/properties/my-properties', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            if (!response.ok) {
              throw new Error("Failed to fetch your properties");
            }
            const data = await response.json();
            setMyProperties(data);
          } catch (error) {
             toast({
                title: "Error",
                description: "Could not load your properties.",
                variant: "destructive"
              });
          } finally {
            setIsLoading(false);
          }
        };
        fetchHostProperties();
      }
    }
  }, [isAuthenticated, user, router, isClient, token, toast]);

  if (!isClient || !isAuthenticated || !user?.roles.includes('HOST')) {
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

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
            <h1 className="text-4xl font-bold font-headline">My Properties</h1>
            <p className="text-muted-foreground mt-2 text-lg">
                Manage your listings, {user?.username}.
            </p>
        </div>
        <Button asChild>
          <Link href="/host/submit-property">
            <PlusCircle className="mr-2" />
            List a New Property
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
               <div key={i} className="space-y-2">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/4" />
                </div>
            ))}
        </div>
      ) : myProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {myProperties.map((property) => (
            <PropertyCard key={property.propertyId} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">No properties listed yet</h2>
          <p className="text-muted-foreground mt-2">Ready to start earning? List your first property now.</p>
          <Button asChild className="mt-4">
            <Link href="/host/submit-property">List your Property</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
