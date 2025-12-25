import { Request, Response } from 'express';
import UserService from '../services/userService';

export const getUserController = async (req: Request, res: Response) => {
  try {

    const userService = new UserService();
    const getUsers = userService.getAllUsers();

    return res.json({ users: getUsers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
