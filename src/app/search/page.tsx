import { PropertyCard } from '@/components/property-card';
import { allProperties } from '@/lib/data';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g. New York" defaultValue="New York, USA" />
              </div>
              <div className="space-y-2">
                <Label>Price Range</Label>
                <Slider defaultValue={[250]} max={1000} step={10} />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>$0</span>
                  <span>$1000+</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="property-type">Property Type</Label>
                <Select>
                  <SelectTrigger id="property-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="cottage">Cottage</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Apply Filters</Button>
            </CardContent>
          </Card>
        </aside>
        <main className="md:col-span-3">
          <h1 className="text-3xl font-bold mb-6 font-headline">Properties in New York, USA</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProperties.map((property) => (
              <PropertyCard key={property.property_id} property={property} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
