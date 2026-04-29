import { Request, Response } from 'express';
import * as bookingDao from '../daos/bookingDao';

function getTodayNumeric(): number {
  const today = new Date();
  const yy = today.getFullYear() % 100;
  const mm = today.getMonth() + 1;
  const dd = today.getDate();
  return yy * 10000 + mm * 100 + dd;
}

export async function createBooking(req: Request, res: Response): Promise<void> {
  try {
    const { accID, npeople, thedate, apiID } = req.body;

    if (accID === undefined || accID === '' ||
        npeople === undefined || npeople === '' ||
        thedate === undefined || thedate === '') {
      res.status(400).json({ error: 'Missing required fields: accID, npeople, thedate.' });
      return;
    }

    if (apiID !== '0x574144') {
      res.status(403).json({ error: 'Invalid apiID.' });
      return;
    }

    const accIdNum = parseInt(accID, 10);
    const npeopleNum = parseInt(npeople, 10);
    const thedateNum = parseInt(thedate, 10);

    if (isNaN(accIdNum) || isNaN(npeopleNum) || isNaN(thedateNum)) {
      res.status(400).json({ error: 'Invalid numeric values for ID, number of people, or date.' });
      return;
    }

    if (npeopleNum < 1) {
      res.status(400).json({ error: 'Number of people must be at least 1.' });
      return;
    }

    const todayNum = getTodayNumeric();
    if (thedateNum < todayNum) {
      res.status(400).json({ error: 'The selected date is in the past.' });
      return;
    }

    const availability = await bookingDao.getAvailability(accIdNum, thedateNum);
    if (!availability) {
      res.status(404).json({ error: 'No availability record found for this accommodation and date.' });
      return;
    }

    if (availability.availability < npeopleNum) {
      res.status(409).json({ error: 'Not enough availability for the requested number of people.' });
      return;
    }

    const userId = req.session.userId as number;

    const bookingId = await bookingDao.createBooking(accIdNum, thedateNum, userId, npeopleNum);
    res.status(201).json({ message: 'Booking created successfully.', bookingId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
