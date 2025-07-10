
import { NextResponse } from 'next/server';
import { users } from '@/lib/users';
import { allProperties } from '@/lib/data';

export async function GET(request: Request) {
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

    const hostProperties = allProperties.filter(p => p.hostname === user.username);
    
    const summarizedProperties = hostProperties.map(p => ({
        propertyId: p.propertyId,
        hostname: p.hostname,
        city: p.city,
        heroImageSrc: p.hero_image_src,
        price_per_night: p.price_per_night,
        name: p.name,
    }));

    return NextResponse.json(summarizedProperties);
  } catch (error) {
    console.error('Fetch host properties error:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
