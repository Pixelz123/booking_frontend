
import { NextResponse } from 'next/server';
import { allProperties } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const { 
        locationQueryString, 
        cheakIn, 
        cheakOut 
    } = await request.json();

    let filteredProperties = allProperties;

    // Filter by location if a query string is provided and it's not a generic search
    if (locationQueryString && locationQueryString.toLowerCase() !== 'everywhere') {
      const searchTerm = locationQueryString.toLowerCase();
      filteredProperties = filteredProperties.filter(property =>
        property.city.toLowerCase().includes(searchTerm) ||
        property.country.toLowerCase().includes(searchTerm) ||
        property.name.toLowerCase().includes(searchTerm) ||
        property.address.toLowerCase().includes(searchTerm)
      );
    }
    
    // In a real application, you would add logic here to filter properties based on availability
    // using the cheakIn and cheakOut dates by checking against existing bookings.
    // For this example, we'll assume all filtered properties are available.

    // Map the full property details to the summary version for the search results page.
    const summarizedProperties = filteredProperties.map(p => ({
        propertyId: p.property_id,
        hostname: p.hostname,
        city: p.city,
        heroImageSrc: p.hero_image_src,
        price_per_night: p.price_per_night,
        name: p.name,
    }));


    return NextResponse.json(summarizedProperties);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ message: 'An internal server error occurred while searching.' }, { status: 500 });
  }
}
