import { getDb } from '../db';
import bcrypt from 'bcrypt';

export interface User {
  ID: number;
  username: string;
  password: string;
  admin: number;
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const db = await getDb();
  return db.get<User>(
    'SELECT * FROM acc_users WHERE username = ?',
    [username]
  );
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
