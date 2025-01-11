import express from 'express';
import payload from 'payload';
import bcrypt from 'bcrypt';
import transporter from '../mailer';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const router = express.Router();

// Handling registration requests
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
    });

    if (existingUser.docs.length > 0) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');
    
    const user = await payload.create({
      collection: 'users',
      data: {
        username,
        email,
        password,
        isVerified: false, // Set to false initially
        verificationToken,
      },
    });

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    
    // Send verification email (optional)
    // await sendVerificationEmail(email, verificationUrl);

    res.status(201).json({ message: 'User registered. Please check your email to verify your account.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message });
  }
});


// handling login requests
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await payload.authenticate({
      collection: 'users',
      username: email,
      password,
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ error: 'Invalid email or password' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('payload-token');
  res.json({ message: 'Logged out successfully' });
});

// handle user profile/ current user
router.get('/me', async (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Function to send verification email
const sendVerificationEmail = async (email, verificationUrl) => {
  await transporter.sendMail({
    from: 'noreply@example.com',
    to: email,
    subject: 'Verify your email',
    text: `Please verify your email by clicking this link: ${verificationUrl}`,
    html: `<p>Please verify your email by clicking this link: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
  });
};

// Function to send password reset email
const sendPasswordResetEmail = async (email, resetUrl) => {
  await transporter.sendMail({
    from: 'noreply@example.com',
    to: email,
    subject: 'Reset your password',
    text: `Please reset your password by clicking this link: ${resetUrl}`,
    html: `<p>Please reset your password by clicking this link: <a href="${resetUrl}">${resetUrl}</a></p>`,
  });
};

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await payload.findByEmail({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const passwordResetToken = await payload.generatePasswordResetToken({ email });
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${passwordResetToken}`;
    
    // Send password reset email
    await sendPasswordResetEmail(email, resetUrl);

    res.status(200).json({ message: 'Password reset instructions sent to your email.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


export default router;