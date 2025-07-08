'use client';

import Image from 'next/image';
import { notFound, useRouter, useParams } from 'next/navigation';
import { allProperties } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BedDouble, Bath, Users, Star, Wifi, Utensils, Wind, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { differenceInDays, format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';

const amenityIcons: { [key: string]: React.ReactNode } = {
  'Wifi': <Wifi className="h-5 w-5" />,
  'Kitchen': <Utensils className="h-5 w-5" />,
  'Air Conditioning': <Wind className="h-5 w-5" />,
};

type Guest = {
    name: string;
    age: string; // Use string to capture input value
};

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const property = allProperties.find((p) => p.property_id === params.id);
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [date, setDate] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState<Guest[]>([{ name: '', age: '' }]);
  const [bookingPayload, setBookingPayload] = useState<string>('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  if (!property) {
    notFound();
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

  const handleReserve = () => {
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
      toast({
        title: "Dates not selected",
        description: "Please select a check-in and check-out date.",
        variant: "destructive",
      });
      return;
    }

    const nights = differenceInDays(date.to, date.from);
     if (nights <= 0) {
        toast({
            title: "Invalid Date Range",
            description: "Check-out date must be after the check-in date.",
            variant: "destructive",
        });
        return;
    }

    if (guests.some(g => !g.name || !g.age)) {
        toast({
            title: "Guest details incomplete",
            description: "Please fill in the name and age for all guests.",
            variant: "destructive",
        });
        return;
    }

    if (guests.length === 0) {
        toast({
            title: "No guests added",
            description: "Please add at least one guest for the reservation.",
            variant: "destructive",
        });
        return;
    }

    const bookingRequest = {
      propertyId: property.property_id,
      guestList: guests.map(g => ({ name: g.name, age: parseInt(g.age, 10) })),
      cheakIn: format(date.from, 'yyyy-MM-dd'),
      cheakOut: format(date.to, 'yyyy-MM-dd'),
    };

    setBookingPayload(JSON.stringify(bookingRequest, null, 2));
    setIsAlertOpen(true);
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* Title and Info Header */}
        <div>
          <h1 className="text-4xl font-bold font-headline">{property.name}</h1>
          <div className="flex items-center gap-4 text-muted-foreground mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span>{property.rating.toFixed(1)} ({property.reviewsCount} reviews)</span>
            </div>
            <span>·</span>
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
                <h2 className="text-2xl font-bold font-headline">{property.type} hosted by {property.hostname}</h2>
                <div className="flex items-center gap-4 text-muted-foreground mt-1">
                  <div className="flex items-center gap-2"><Users className="h-5 w-5" /> {property.guests} guests</div>
                  <div className="flex items-center gap-2"><BedDouble className="h-5 w-5" /> {property.bedroom} bedrooms</div>
                  <div className="flex items-center gap-2"><Bath className="h-5 w-5" /> {property.bathroom} bathrooms</div>
                </div>
              </div>
              <Avatar className="h-16 w-16">
                <AvatarImage src={property.host_avatar_src} alt={property.hostname} data-ai-hint="person portrait" />
                <AvatarFallback>{property.hostname.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            
            <Separator className="my-6" />

            <p className="text-foreground/90">{property.description}</p>
            
            <Separator className="my-6" />

            <h3 className="text-xl font-bold font-headline mb-4">What this place offers</h3>
            <div className="grid grid-cols-2 gap-4">
              {property.amenities.map(amenity => (
                <div key={amenity} className="flex items-center gap-3">
                  {amenityIcons[amenity] || <Star className="h-5 w-5" />}
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
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
                  disabled={{ before: new Date() }}
                />
                
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start font-normal">
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
                >
                  Reserve
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-2">You won't be charged yet</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Booking Request Payload</AlertDialogTitle>
            <AlertDialogDescription>
              Here is the JSON payload that would be sent to the backend:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 max-h-60 overflow-y-auto rounded-md border bg-muted p-4">
            <pre className="text-sm text-muted-foreground">
              <code>{bookingPayload}</code>
            </pre>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setIsAlertOpen(false);
                toast({
                  title: "Reservation Submitted!",
                  description: `Your booking for ${property.name} with ${guests.length} guest(s) has been requested.`,
                });
              }}
            >
              Confirm & Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
