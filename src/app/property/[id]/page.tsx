import Image from 'next/image';
import { notFound } from 'next/navigation';
import { allProperties } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BedDouble, Bath, Users, Star, Wifi, Utensils, Wind } from 'lucide-react';

const amenityIcons: { [key: string]: React.ReactNode } = {
  'Wifi': <Wifi className="h-5 w-5" />,
  'Kitchen': <Utensils className="h-5 w-5" />,
  'Air Conditioning': <Wind className="h-5 w-5" />,
};


export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = allProperties.find((p) => p.id === params.id);

  if (!property) {
    notFound();
  }

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
                    src={property.heroImage}
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
                <h2 className="text-2xl font-bold font-headline">{property.type} hosted by {property.host.name}</h2>
                <div className="flex items-center gap-4 text-muted-foreground mt-1">
                  <div className="flex items-center gap-2"><Users className="h-5 w-5" /> {property.details.guests} guests</div>
                  <div className="flex items-center gap-2"><BedDouble className="h-5 w-5" /> {property.details.bedrooms} bedrooms</div>
                  <div className="flex items-center gap-2"><Bath className="h-5 w-5" /> {property.details.bathrooms} bathrooms</div>
                </div>
              </div>
              <Avatar className="h-16 w-16">
                <AvatarImage src={property.host.avatar} alt={property.host.name} data-ai-hint="person portrait" />
                <AvatarFallback>{property.host.name.charAt(0)}</AvatarFallback>
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
                  <span className="text-2xl font-bold">${property.pricePerNight}</span>
                  <span className="text-base font-normal text-muted-foreground"> / night</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="range"
                  numberOfMonths={1}
                  className="p-0"
                />
                <Button className="w-full mt-4 h-12 text-lg bg-accent text-accent-foreground hover:bg-accent/90">
                  Reserve
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
