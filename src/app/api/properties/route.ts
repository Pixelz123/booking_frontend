
import { NextResponse } from 'next/server';
import { users } from '@/lib/users';
import { allProperties } from '@/lib/data';
import type { PropertyDetail } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Authorization header is missing or invalid' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const userIdMatch = token.match(/dummy-token-for-(.*)/);
    if (!userIdMatch) {
      return NextResponse.json({ message: 'Invalid token format' }, { status: 401 });
    }
    const userId = userIdMatch[1];
    const user = users.find(u => u.id === userId);

    if (!user || !user.roles.includes('HOST')) {
      return NextResponse.json({ message: 'Unauthorized: User is not a host' }, { status: 403 });
    }

    const body = await request.json();
    
    const newProperty: PropertyDetail = {
      property_id: `prop${allProperties.length + 1}`,
      name: body.name,
      description: body.description,
      city: body.city,
      state: body.state,
      country: body.country,
      postal_code: body.postal_code,
      address: body.address,
      price_per_night: body.price_per_night,
      imageList: body.imageList,
      hero_image_src: body.hero_image_src,
      guests: body.guests,
      bedroom: body.bedroom,
      beds: body.beds,
      bathroom: body.bathroom,
      type: 'Apartment', // Placeholder
      rating: 0, // Placeholder
      reviewsCount: 0, // Placeholder
      hostname: user.username,
      host_avatar_src: 'https://placehold.co/100x100.png', // Placeholder
    };

    allProperties.push(newProperty);

    return NextResponse.json(newProperty, { status: 201 });

  } catch (error) {
    console.error('Submit property error:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
