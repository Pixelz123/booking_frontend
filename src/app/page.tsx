
import { PropertySearchForm } from '@/components/property-search-form';

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
    </div>
  );
}
