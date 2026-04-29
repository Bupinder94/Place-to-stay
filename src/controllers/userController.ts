import { Request, Response } from 'express';
import * as userDao from '../daos/userDao';

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required.' });
      return;
    }

    const user = await userDao.getUserByUsername(username);
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    const valid = await userDao.verifyPassword(password, user.password);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    req.session.userId = user.ID;
    req.session.username = user.username;
    res.json({ message: 'Logged in successfully.', username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: 'Failed to log out.' });
    } else {
      res.json({ message: 'Logged out successfully.' });
    }
  });
}

export async function getSession(req: Request, res: Response): Promise<void> {
  if (req.session && req.session.userId) {
    res.json({ loggedIn: true, username: req.session.username });
  } else {
    res.json({ loggedIn: false });
  }
}
