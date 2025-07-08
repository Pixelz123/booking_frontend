'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, MapPin, Search } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function PropertySearchForm() {
  const [location, setLocation] = useState('New York, USA');
  const [date, setDate] = useState<DateRange | undefined>();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) {
      params.set('locationQueryString', location);
    }
    if (date?.from) {
      params.set('cheakIn', format(date.from, 'yyyy-MM-dd'));
    }
    if (date?.to) {
      params.set('cheakOut', format(date.to, 'yyyy-MM-dd'));
    }
    
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto p-4 bg-card rounded-lg shadow-md border">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="md:col-span-2">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              name="locationQueryString"
              placeholder="Where are you going?"
              className="pl-10 text-base"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal h-11",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button type="submit" className="h-11 bg-accent text-accent-foreground hover:bg-accent/90 w-full flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search
        </Button>
      </div>
    </form>
  );
}
