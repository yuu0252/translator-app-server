import JWT from 'jsonwebtoken';
import User from '../models/User';
import { NextFunction, Request, Response } from 'express';
import { serverEnv } from '../../../serverEnv';

const tokenDecode = (req: Request) => {
  const bearerHeader = req.headers['authorization'];
  if (bearerHeader) {
    try {
      const bearer = bearerHeader.split(' ')[1];
      try {
        const decodedToken = JWT.verify(bearer, serverEnv.TOKEN_SECRET_KEY);
        return decodedToken;
      } catch {
        return false;
      }
    } catch {
      return false;
    }
  }
};

export const verifyToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const tokenDecoded: any = tokenDecode(req);
  if (tokenDecoded) {
    const user = await User.findById(tokenDecoded.id);
    if (!user) {
      return res.status(401).json('権限がありません');
    }
    req.user = user;
    next();
  } else {
    return res.status(401).json('権限がありません');
  }
};
