
export type User = {
  id: string;
  username: string;
  password: string; // In a real app, this would be a hash
  roles: ('USER' | 'HOST')[];
  firstName: string;
  lastName: string;
  email: string;
};

// Dummy users. In a real app, this would be a database.
export const users: User[] = [
  {
    id: 'user-1',
    username: 'Max Robinson',
    password: 'password',
    roles: ['USER'],
    firstName: 'Max',
    lastName: 'Robinson',
    email: 'max@example.com'
  },
  {
    id: 'user-2',
    username: 'Sarah Host',
    password: 'password',
    roles: ['HOST'],
    firstName: 'Sarah',
    lastName: 'Host',
    email: 'sarah@example.com'
  },
   {
    id: 'user-3',
    username: 'Test User',
    password: 'password',
    roles: ['USER'],
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com'
  }
];

export const findUserByUsername = (username: string) => users.find(u => u.username === username);
export const addUser = (user: Omit<User, 'id'>) => {
    const newUser = { ...user, id: `user-${users.length + 1}`};
    users.push(newUser);
    return newUser;
}
