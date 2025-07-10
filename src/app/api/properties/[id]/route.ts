
import { NextResponse } from 'next/server';
import { allProperties } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id;
    const property = allProperties.find(p => p.property_id === propertyId);

    if (!property) {
      return NextResponse.json({ message: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('Get property by ID error:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
