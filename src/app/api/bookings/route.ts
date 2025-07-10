
import { NextResponse } from 'next/server';
import { users } from '@/lib/users';
import { allProperties, myBookings } from '@/lib/data';
import { differenceInDays, parseISO } from 'date-fns';
import type { Booking } from '@/lib/types';
import type { User } from '@/lib/users';

// Helper function to extract user from token
const getUserFromToken = (authHeader: string | null): User | undefined => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return undefined;
    }
    const token = authHeader.split(' ')[1];
    const userIdMatch = token.match(/dummy-token-for-(.*)/);
    if (!userIdMatch) {
        return undefined;
    }
    const userId = userIdMatch[1];
    return users.find(u => u.id === userId);
}

// GET /api/bookings - Fetch bookings for the logged-in user
export async function GET(request: Request) {
    try {
        const user = getUserFromToken(request.headers.get('Authorization'));
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const userBookings = myBookings.filter(b => b.userId === user.id);
        return NextResponse.json(userBookings);

    } catch (error) {
        console.error('Fetch bookings error:', error);
        return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
    }
}


// POST /api/bookings - Create a new booking
export async function POST(request: Request) {
    try {
        const user = getUserFromToken(request.headers.get('Authorization'));
        if (!user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { propertyId, cheakIn, cheakOut, guestList } = body;

        if (!propertyId || !cheakIn || !cheakOut || !guestList) {
            return NextResponse.json({ message: 'Missing required booking information' }, { status: 400 });
        }

        const property = allProperties.find(p => p.propertyId === propertyId);
        if (!property) {
            return NextResponse.json({ message: 'Property not found' }, { status: 404 });
        }

        const checkInDate = parseISO(cheakIn);
        const checkOutDate = parseISO(cheakOut);
        const nights = differenceInDays(checkOutDate, checkInDate);

        if (nights <= 0) {
            return NextResponse.json({ message: 'Invalid date range' }, { status: 400 });
        }
        
        if(guestList.length > property.guests) {
             return NextResponse.json({ message: `This property only accommodates ${property.guests} guests.` }, { status: 400 });
        }

        const newBooking: Booking = {
            bookingId: `booking-${myBookings.length + 1}-${Date.now()}`,
            userId: user.id,
            property: property,
            cheakIn: cheakIn,
            cheakOut: cheakOut,
            guests: guestList.length,
            totalPrice: nights * property.price_per_night,
        };

        myBookings.push(newBooking);

        return NextResponse.json(newBooking, { status: 201 });

    } catch (error) {
        console.error('Create booking error:', error);
        return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
    }
}
