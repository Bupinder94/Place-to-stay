import express from 'express';
import session from 'express-session';
import path from 'path';
import accommodationRoutes from './routes/accommodationRoutes';
import bookingRoutes from './routes/bookingRoutes';
import userRoutes from './routes/userRoutes';
import { getDb } from './db';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'places-to-stay-secret-key-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }
}));

app.use(express.static(path.join(__dirname, '..', 'public'), {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-cache');
  }
}));

app.use('/api/accommodation', accommodationRoutes);
app.use('/api/book', bookingRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

async function start(): Promise<void> {
  await getDb();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
