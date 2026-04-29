import { getDb } from '../db';

export interface Booking {
  ID: number;
  accID: number;
  thedate: number;
  userID: number;
  npeople: number;
}

export interface DateAvailability {
  ID: number;
  accID: number;
  thedate: number;
  availability: number;
}

export async function getAvailability(accID: number, thedate: number): Promise<DateAvailability | undefined> {
  const db = await getDb();
  return db.get<DateAvailability>(
    'SELECT * FROM acc_dates WHERE accID = ? AND thedate = ?',
    [accID, thedate]
  );
}

export async function createBooking(accID: number, thedate: number, userID: number, npeople: number): Promise<number> {
  const db = await getDb();
  const result = await db.run(
    'INSERT INTO acc_bookings (accID, thedate, userID, npeople) VALUES (?, ?, ?, ?)',
    [accID, thedate, userID, npeople]
  );
  await db.run(
    'UPDATE acc_dates SET availability = availability - ? WHERE accID = ? AND thedate = ?',
    [npeople, accID, thedate]
  );
  return result.lastID as number;
}

export async function getBookingsByUser(userID: number): Promise<Booking[]> {
  const db = await getDb();
  return db.all<Booking[]>(
    'SELECT * FROM acc_bookings WHERE userID = ?',
    [userID]
  );
}
