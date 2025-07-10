'use client';

import Image from 'next/image';
import { notFound, useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { BedDouble, Bath, Users, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { differenceInDays, format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { PropertyDetail } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


type Guest = {
    name: string;
    age: string; // Use string to capture input value
};

function PropertyDetailSkeleton() {
  return (
    <div className="bg-background animate-pulse">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div>
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/4" />
        </div>
        <div className="mt-6">
          <Skeleton className="h-[400px] md:h-[500px] w-full rounded-lg" />
        </div>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-8 w-1/2 mb-2" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-28" />
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <Skeleton className="h-8 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-60 w-full" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PropertyDetailPage() {
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, token } = useAuth();
  
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  const [date, setDate] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState<Guest[]>([{ name: '', age: '' }]);

  useEffect(() => {
    const fetchProperty = async () => {
        if (!params.id) return;
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE}/public/propertyDetails/${params.id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    notFound();
                }
                throw new Error("Failed to fetch property details");
            }
            const data = await response.json();
            setProperty(data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Could not load property details. Please try again later.",
                variant: "destructive",
            });
            // Optional: redirect to a generic error page or back
            router.push('/search');
        } finally {
            setIsLoading(false);
        }
    };

    fetchProperty();
  }, [params.id, router, toast]);

  if (isLoading) {
    return <PropertyDetailSkeleton />;
  }

  if (!property) {
    // This case will be handled by the notFound() in the fetch logic
    // but as a fallback we can render a message.
    return <div>Property not found.</div>;
  }
  
  const handleGuestChange = (index: number, field: keyof Guest, value: string) => {
    const newGuests = [...guests];
    newGuests[index][field] = value;
    setGuests(newGuests);
  };

  const handleAddGuest = () => {
    if (guests.length < property.guests) {
      setGuests([...guests, { name: '', age: '' }]);
    } else {
        toast({
            title: "Guest limit reached",
            description: `This property can accommodate a maximum of ${property.guests} guests.`,
            variant: "destructive",
        });
    }
  };

  const handleRemoveGuest = (index: number) => {
    const newGuests = guests.filter((_, i) => i !== index);
    setGuests(newGuests);
  };

  const handleReserve = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a reservation.",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }

    if (!date || !date.from || !date.to) {
      toast({ title: "Dates not selected", description: "Please select a check-in and check-out date.", variant: "destructive" });
      return;
    }
    const nights = differenceInDays(date.to, date.from);
    if (nights <= 0) {
        toast({ title: "Invalid Date Range", description: "Check-out date must be after the check-in date.", variant: "destructive" });
        return;
    }
    if (guests.some(g => !g.name || !g.age)) {
        toast({ title: "Guest details incomplete", description: "Please fill in the name and age for all guests.", variant: "destructive" });
        return;
    }
    if (guests.length === 0) {
        toast({ title: "No guests added", description: "Please add at least one guest for the reservation.", variant: "destructive" });
        return;
    }

    setIsBooking(true);
    const bookingRequest = {
      propertyId: property.property_id,
      guestList: guests.map(g => ({ name: g.name, age: parseInt(g.age, 10) })),
      cheakIn: format(date.from, 'yyyy-MM-dd'),
      cheakOut: format(date.to, 'yyyy-MM-dd'),
    };

    try {
        const response = await fetch(`${API_BASE}/api/booking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bookingRequest)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to make reservation');
        }

        toast({
          title: "Reservation Submitted!",
          description: `Your booking for ${property.name} with ${guests.length} guest(s) has been requested.`,
        });
        // Optionally redirect to bookings page
        router.push('/bookings');

    } catch(error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        toast({ title: "Reservation Error", description: errorMessage, variant: "destructive" });
    } finally {
        setIsBooking(false);
    }
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* Title and Info Header */}
        <div>
            <h1 className="text-4xl font-bold font-headline">{property.name}</h1>
          <div className="flex items-center gap-4 text-muted-foreground mt-2">
            <span>{property.city}, {property.country}</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="relative h-[400px] md:h-[500px] col-span-1 md:col-span-2">
                 <Image
                    src={property.hero_image_src}
                    alt={property.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                    data-ai-hint="apartment interior"
                  />
            </div>
        </div>


        {/* Main Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold font-headline">Hosted by {property.hostname}</h2>
                <div className="flex items-center gap-4 text-muted-foreground mt-1">
                  <div className="flex items-center gap-2"><Users className="h-5 w-5" /> {property.guests} guests</div>
                  <div className="flex items-center gap-2"><BedDouble className="h-5 w-5" /> {property.bedroom} bedrooms</div>
                  <div className="flex items-center gap-2"><Bath className="h-5 w-5" /> {property.bathroom} bathrooms</div>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />

            <p className="text-foreground/90">{property.description}</p>
                      
          </div>
          
          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline">
                  <span className="text-2xl font-bold">${property.price_per_night}</span>
                  <span className="text-base font-normal text-muted-foreground"> / night</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Calendar
                  mode="range"
                  numberOfMonths={1}
                  className="p-0"
                  selected={date}
                  onSelect={setDate}
                  disabled={isBooking || { before: new Date() }}
                />
                
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start font-normal" disabled={isBooking}>
                            <Users className="mr-2 h-4 w-4" />
                            {guests.length} Guest(s)
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Guests</h4>
                                <p className="text-sm text-muted-foreground">
                                    This property accommodates {property.guests} guests max.
                                </p>
                            </div>
                            <div className="grid gap-2 max-h-60 overflow-y-auto pr-2">
                                {guests.map((guest, index) => (
                                    <div key={index} className="grid grid-cols-6 items-center gap-2">
                                        <div className="col-span-3">
                                            <Label htmlFor={`guest-name-${index}`} className="sr-only">Name</Label>
                                            <Input 
                                                id={`guest-name-${index}`}
                                                placeholder="Name"
                                                value={guest.name}
                                                onChange={(e) => handleGuestChange(index, 'name', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <Label htmlFor={`guest-age-${index}`} className="sr-only">Age</Label>
                                             <Input 
                                                id={`guest-age-${index}`}
                                                type="number"
                                                placeholder="Age"
                                                value={guest.age}
                                                onChange={(e) => handleGuestChange(index, 'age', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            {guests.length > 1 && (
                                                <Button variant="ghost" size="icon" onClick={() => handleRemoveGuest(index)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                             <Button onClick={handleAddGuest} variant="outline" className="w-full">
                                Add Guest
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>

                <Button 
                  onClick={handleReserve}
                  className="w-full h-12 text-lg bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={isBooking}
                >
                  {isBooking ? 'Reserving...' : 'Reserve'}
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-2">You won't be charged yet</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
