export interface MockUser {
  id: number;
  email: string;
  password: string;
  name: string;
  role: 'profesor' | 'admin';
}

export const MOCK_USERS: MockUser[] = [
  {
    id: 2,
    email: 'admin',
    password: 'admin123',
    name: 'Administrator',
    role: 'admin',
  },
  {
    id: 3,
    email: 'test',
    password: 'test123',
    name: 'Test User',
    role: 'profesor',
  },
];