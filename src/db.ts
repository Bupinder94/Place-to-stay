import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import bcrypt from 'bcrypt';

const DB_PATH = path.join(__dirname, '..', 'places.db');

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export async function getDb(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
  if (!db) {
    db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });
    await initDb();
  }
  return db;
}

async function initDb(): Promise<void> {
  if (!db) return;

  await db.exec(`
    CREATE TABLE IF NOT EXISTS accommodation (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      location TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS acc_dates (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      accID INTEGER NOT NULL,
      thedate INTEGER NOT NULL,
      availability INTEGER NOT NULL,
      FOREIGN KEY (accID) REFERENCES accommodation(ID)
    );

    CREATE TABLE IF NOT EXISTS acc_bookings (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      accID INTEGER NOT NULL,
      thedate INTEGER NOT NULL,
      userID INTEGER NOT NULL,
      npeople INTEGER NOT NULL,
      FOREIGN KEY (accID) REFERENCES accommodation(ID),
      FOREIGN KEY (userID) REFERENCES acc_users(ID)
    );

    CREATE TABLE IF NOT EXISTS acc_users (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      admin INTEGER NOT NULL DEFAULT 0
    );
  `);

  const accCount = await db.get<{ count: number }>('SELECT COUNT(*) as count FROM accommodation');
  if (accCount && accCount.count === 0) {
    await seedData();
  }
}

async function seedData(): Promise<void> {
  if (!db) return;

  const accommodations = [
    ['Grand Hotel', 'hotel', 'Southampton', 50.9097, -1.4044],
    ['Seaview B&B', 'bed and breakfast', 'Southampton', 50.8950, -1.3960],
    ['London Hostel', 'hostel', 'London', 51.5074, -0.1278],
    ['The Capital', 'hotel', 'London', 51.5033, -0.1195],
    ['Hampshire Inn', 'hotel', 'Hampshire', 51.0577, -1.3081],
    ['Normandy Retreat', 'bed and breakfast', 'Normandy', 49.1829, -0.3707],
    ['Colorado Lodge', 'hostel', 'Colorado', 39.5501, -105.7821]
  ];

  for (const acc of accommodations) {
    await db.run(
      'INSERT INTO accommodation (name, type, location, latitude, longitude) VALUES (?, ?, ?, ?, ?)',
      acc
    );
  }

  const dates = [260630, 260701, 260702];
  for (let accID = 1; accID <= accommodations.length; accID++) {
    for (const date of dates) {
      await db.run(
        'INSERT INTO acc_dates (accID, thedate, availability) VALUES (?, ?, ?)',
        [accID, date, 5]
      );
    }
  }

  const users = [
    ['jsmith', 'password123', 0],
    ['admin', 'adminpass', 1]
  ];

  for (const user of users) {
    const hash = await bcrypt.hash(user[1] as string, 10);
    await db.run(
      'INSERT INTO acc_users (username, password, admin) VALUES (?, ?, ?)',
      [user[0], hash, user[2]]
    );
  }
}
