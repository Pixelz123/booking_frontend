import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import type { Property } from '@/lib/types';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/property/${property.property_id}`} className="group">
      <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-xl">
        <CardContent className="p-0">
          <div className="relative">
            <Image
              src={property.hero_image_src}
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
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span>{property.rating.toFixed(1)}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{property.city}, {property.country}</p>
            <p className="mt-2">
              <span className="font-bold text-lg">${property.price_per_night}</span>
              <span className="text-sm text-muted-foreground"> / night</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
