import { Request, Response } from 'express';
import * as accommodationDao from '../daos/accommodationDao';

export async function getByLocation(req: Request, res: Response): Promise<void> {
  try {
    const location = req.query.location as string;
    if (!location || location.trim().length === 0) {
      res.status(400).json({ error: 'Location parameter is required.' });
      return;
    }
    const results = await accommodationDao.getAllByLocation(location.trim());
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

export async function getByTypeAndLocation(req: Request, res: Response): Promise<void> {
  try {
    const location = req.query.location as string;
    const type = req.query.type as string;
    if (!location || location.trim().length === 0 || !type || type.trim().length === 0) {
      res.status(400).json({ error: 'Location and type parameters are required.' });
      return;
    }
    const results = await accommodationDao.getByTypeAndLocation(type.trim(), location.trim());
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
