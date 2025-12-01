// src/middlewares/authenticate.js
import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization') || '';
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw createHttpError(401, 'No token provided');
    }

    const session = await SessionsCollection.findOne({ accessToken: token });

    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    const isAccessTokenExpired =
      new Date() > new Date(session.accessTokenValidUntil);

    if (isAccessTokenExpired) {
      throw createHttpError(401, 'Access token expired');
    }

    const user = await UsersCollection.findById(session.userId);

    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = user;
    req.session = session;

    next();
  } catch (err) {
    next(err);
  }
};
