
import { NextResponse } from 'next/server';
import { users } from '@/lib/users';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Authorization header is missing or invalid' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    // Dummy token format: "dummy-token-for-user-1"
    const userIdMatch = token.match(/dummy-token-for-(.*)/);
    if (!userIdMatch) {
      return NextResponse.json({ message: 'Invalid token format' }, { status: 401 });
    }
    const userId = userIdMatch[1];
    
    const user = users.find(u => u.id === userId);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (!user.roles.includes('HOST')) {
      user.roles.push('HOST');
    }

    // In a real app, you might re-issue a token with updated claims
    return NextResponse.json({
      username: user.username,
      roles: user.roles,
    });

  } catch (error) {
    console.error('Become host error:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
