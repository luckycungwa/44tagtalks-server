// src/middleware/userAuthentication.js
import jwt from 'jsonwebtoken';
import payload from 'payload';

const userAuthentication = async (req, res, next) => {
  const token = req.cookies['payload-token'] || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await payload.findByID({
      collection: 'users',
      id: decoded.userId,
    });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = user; // Attach user to request
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export default userAuthentication;
