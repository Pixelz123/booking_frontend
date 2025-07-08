'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { PropertySummary } from '@/lib/types';
import { useState } from 'react';
import { Button } from './ui/button';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';

interface PropertyCardProps {
  property: PropertySummary;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [selectedPropertyJson, setSelectedPropertyJson] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleViewJson = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedPropertyJson(JSON.stringify(property, null, 2));
    setIsAlertOpen(true);
  };

  return (
    <>
      <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col">
        <Link href={`/property/${property.propertyId}`} className="group block">
          <CardContent className="p-0">
            <div className="relative">
              <Image
                src={property.heroImageSrc}
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
         <CardFooter className="p-4 pt-0 mt-auto">
           <Button variant="secondary" className="w-full" onClick={handleViewJson}>View JSON</Button>
        </CardFooter>
      </Card>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Property Data (JSON)</AlertDialogTitle>
            <AlertDialogDescription>
              This is the full JSON data object for the selected property.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 max-h-60 overflow-y-auto rounded-md border bg-muted p-4">
            <pre className="text-sm text-muted-foreground">
              <code>{selectedPropertyJson}</code>
            </pre>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsAlertOpen(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
