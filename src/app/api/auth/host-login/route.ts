
import { NextResponse } from 'next/server';
import { findUserByUsername } from '@/lib/users';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    const user = findUserByUsername(username);

    if (!user || user.password !== password) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    if (!user.roles.includes('HOST')) {
      return NextResponse.json({ message: 'This account is not a host account. Please login as a user.' }, { status: 403 });
    }

    // In a real app, you would generate a JWT token here.
    const token = `dummy-token-for-${user.id}`;
    
    return NextResponse.json({
      username: user.username,
      roles: user.roles,
      token: token
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
