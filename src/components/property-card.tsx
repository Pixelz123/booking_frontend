'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { PropertySummary } from '@/lib/types';

interface PropertyCardProps {
  property: PropertySummary;
}

export function PropertyCard({ property }: PropertyCardProps) {

  return (
      <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col">
        <Link href={`/property/${property.propertyId}`} className="group block flex-grow">
          <CardContent className="p-0">
            <div className="relative">
              <Image
                src="https://placehold.co"
                alt={property.name}
                width={600}
                height={400}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint="apartment building"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg truncate font-headline">{property.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{property.city}</p>
              <p className="mt-2">
                <span className="font-bold text-lg">${property.price_per_night}</span>
                <span className="text-sm text-muted-foreground"> / night</span>
              </p>
            </div>
          </CardContent>
        </Link>
      </Card>
  );
}
