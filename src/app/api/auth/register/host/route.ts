
import { NextResponse } from 'next/server';
import { findUserByUsername, addUser, User } from '@/lib/users';

export async function POST(request: Request) {
  try {
    const { username, password, firstName, lastName, email } = await request.json();

    if (!username || !password || !firstName || !lastName || !email) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }
     if (findUserByUsername(username)) {
        return NextResponse.json({ message: 'Username already exists' }, { status: 409 });
    }


    const newUser: Omit<User, 'id'> = {
        username,
        password, // In a real app, hash this
        firstName,
        lastName,
        email,
        roles: ['HOST']
    };

    const createdUser = addUser(newUser);

    // In a real app, you would generate a JWT token here.
    const token = `dummy-token-for-${createdUser.id}`;
    
    return NextResponse.json({
      username: createdUser.username,
      roles: createdUser.roles,
      token: token
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
