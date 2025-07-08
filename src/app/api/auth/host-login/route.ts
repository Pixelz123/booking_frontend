// This route is deprecated. Use /api/auth/loginAsHost instead.
import {NextResponse} from 'next/server';
export async function POST(request: Request) {
    return NextResponse.json({ message: 'This endpoint is deprecated. Use /api/auth/loginAsHost instead.' }, { status: 410 });
}
