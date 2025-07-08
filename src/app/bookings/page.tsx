
'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { myBookings } from '@/lib/data';
import { Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';
import type { Booking } from '@/lib/types';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';

export default function MyBookingsPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [selectedBookingJson, setSelectedBookingJson] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router, isClient]);

  const handleViewJson = (booking: Booking) => {
    const simplifiedBooking = {
      bookingId: booking.bookingId,
      property: {
        property_id: booking.property.property_id,
        name: booking.property.name,
        hostname: booking.property.hostname,
        city: booking.property.city,
        country: booking.property.country,
        hero_image_src: booking.property.hero_image_src,
      },
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
      totalPrice: booking.totalPrice,
    };
    setSelectedBookingJson(JSON.stringify(simplifiedBooking, null, 2));
    setIsAlertOpen(true);
  };

  if (!isClient || !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your bookings.</p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-headline">My Bookings</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Here are your upcoming and past trips, {user?.username}.
          </p>
        </div>

        {myBookings.length > 0 ? (
          <div className="grid gap-8">
            {myBookings.map((booking) => (
              <Card key={booking.bookingId} className="overflow-hidden md:flex shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="md:w-1/3 relative h-48 md:h-auto">
                  <Image
                    src={booking.property.hero_image_src}
                    alt={booking.property.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                    data-ai-hint="apartment building"
                  />
                </div>
                <CardContent className="p-6 md:w-2/3 flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{booking.property.city}, {booking.property.country}</p>
                    <h2 className="text-2xl font-bold font-headline mt-1">{booking.property.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1">Hosted by {booking.property.hostname}</p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground mt-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(booking.checkIn), 'MMM d, yyyy')} - {format(new Date(booking.checkOut), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{booking.guests} Guest(s)</span>
                      </div>
                    </div>
                     <p className="font-semibold text-lg mt-4">
                      Total paid: ${booking.totalPrice.toLocaleString()}
                    </p>
                  </div>
                  <div className="mt-6 flex gap-4">
                    <Button asChild>
                      <Link href={`/property/${booking.property.property_id}`}>View Property</Link>
                    </Button>
                    <Button variant="outline">Manage Booking</Button>
                    <Button variant="secondary" onClick={() => handleViewJson(booking)}>View JSON</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
           <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <h2 className="text-xl font-semibold">No bookings yet</h2>
              <p className="text-muted-foreground mt-2">Start exploring to find your next adventure!</p>
              <Button asChild className="mt-4">
                <Link href="/search">Start Searching</Link>
              </Button>
            </div>
        )}
      </div>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Booking Data (JSON)</AlertDialogTitle>
            <AlertDialogDescription>
              This is the JSON data object for the selected booking, simplified to include only the fields displayed in this component.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 max-h-60 overflow-y-auto rounded-md border bg-muted p-4">
            <pre className="text-sm text-muted-foreground">
              <code>{selectedBookingJson}</code>
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
