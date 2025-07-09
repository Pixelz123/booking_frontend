
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PropertyCard } from '@/components/property-card';
import { PropertySearchForm } from '@/components/property-search-form';
import type { PropertySummary } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

function SearchResults() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [properties, setProperties] = useState<PropertySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = searchParams.get('locationQueryString') || 'everywhere';

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const locationQueryString = searchParams.get('locationQueryString');
        const cheakIn = searchParams.get('cheakIn');
        const cheakOut = searchParams.get('cheakOut');

        const searchPayload = {
          locationQueryString: locationQueryString || 'everywhere',
          cheakIn: cheakIn || null,
          cheakOut: cheakOut || null,
        };
        
        const response = await fetch('http://10.91.233.181:8080/public/properties', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(searchPayload),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        toast({
          title: "Search Error",
          description: "Could not load properties. Please try again later.",
          variant: "destructive",
        });
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams, toast]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="mb-8">
        <PropertySearchForm />
      </div>

      <main>
        <h1 className="text-3xl font-bold mb-6 font-headline">
          Properties in {location === 'everywhere' ? 'Everywhere' : location}
        </h1>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/4" />
              </div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.propertyId} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <h2 className="text-xl font-semibold">No properties found</h2>
              <p className="text-muted-foreground mt-2">Try adjusting your search filters.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchResults />
        </Suspense>
    )
}
