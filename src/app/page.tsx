import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PropertySearchForm } from '@/components/property-search-form';
import { PropertyCard } from '@/components/property-card';
import { featuredProperties } from '@/lib/data';

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="w-full py-20 md:py-32 lg:py-40 bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter font-headline">
            Find Your Next Perfect Stay
          </h1>
          <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl mt-4">
            Discover and book unique properties around the world. Your adventure starts here.
          </p>
          <div className="mt-8">
            <PropertySearchForm />
          </div>
        </div>
      </section>
      
      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Featured Properties</h2>
            <Button asChild variant="link" className="text-accent-foreground p-0 h-auto">
              <Link href="/search">
                View All
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.property_id} property={property} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
