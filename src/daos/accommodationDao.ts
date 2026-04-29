import { getDb } from '../db';

export interface Accommodation {
  ID: number;
  name: string;
  type: string;
  location: string;
  latitude: number;
  longitude: number;
}

export async function getAllByLocation(location: string): Promise<Accommodation[]> {
  const db = await getDb();
  return db.all<Accommodation[]>(
    'SELECT * FROM accommodation WHERE location = ?',
    [location]
  );
}

export async function getByTypeAndLocation(type: string, location: string): Promise<Accommodation[]> {
  const db = await getDb();
  return db.all<Accommodation[]>(
    'SELECT * FROM accommodation WHERE type = ? AND location = ?',
    [type, location]
  );
}

export async function getById(id: number): Promise<Accommodation | undefined> {
  const db = await getDb();
  return db.get<Accommodation>(
    'SELECT * FROM accommodation WHERE ID = ?',
    [id]
  );
}
